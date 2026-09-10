import { useState, useRef, useEffect, useMemo, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ColumnChart as ColumnChartDisplay } from '@faclon-labs/design-sdk/ColumnChart';
import { ComboLineChart } from '@faclon-labs/design-sdk/ComboLineChart';
import { buildComparisonSeries } from '@faclon-labs/design-sdk';
import type { ComparisonSourceData, ChartShiftConfig, ShiftSeriesInput } from '@faclon-labs/design-sdk';
import { LineChart } from '@faclon-labs/design-sdk/LineChart';
import { AreaChart } from '@faclon-labs/design-sdk/AreaChart';
import { ChartSwitcher } from '@faclon-labs/design-sdk/ChartSwitcher';
import { exportChart, Chart } from '@faclon-labs/design-sdk/Chart';
import type { ChartExportFormat } from '@faclon-labs/design-sdk/Chart';
import { DatePicker, getPresetDateRange } from '@faclon-labs/design-sdk/DatePicker';
import type { DateRange, ComparisonDateRange } from '@faclon-labs/design-sdk/DatePicker';
import { Breadcrumb, BreadcrumbItem } from '@faclon-labs/design-sdk/Breadcrumb';
import { DropdownMenu, ActionListItem, ActionListItemGroup } from '@faclon-labs/design-sdk/DropdownMenu';
import { Tooltip } from '@faclon-labs/design-sdk/Tooltip';
import { SelectInput } from '@faclon-labs/design-sdk/SelectInput';
import { IconButton } from '@faclon-labs/design-sdk/IconButton';
import { EmptyState } from '@faclon-labs/design-sdk/EmptyState';
import { AddWidgetIllustration } from '@faclon-labs/design-sdk/EmptyState/illustrations/AddWidgetIllustration';
import { NoDataOneIllustration } from '@faclon-labs/design-sdk/EmptyState/illustrations/NoDataOneIllustration';
import { TechnicalHiccupIllustration } from '@faclon-labs/design-sdk/EmptyState/illustrations/TechnicalHiccupIllustration';
import { Spinner } from '@faclon-labs/design-sdk/Spinner';
import { Home, Settings, Info, Menu } from 'react-feather';
import {
  DataEntry,
  WidgetEvent,
  ColumnChartUIConfig,
  ChartConfig,
  SeriesPayload,
  WidgetAdvancedSettingsConfig,
  WidgetFontWeight,
  TimeConfig,
  Duration,
} from '../../iosense-sdk/types';
import { resolveDurationWindow } from '../../iosense-sdk/time';
import { getValue, getSeriesData } from '../../iosense-sdk/mini-engine';
import './CombinedBarLineChart.css';

interface CombinedBarLineChartProps {
  config?: ColumnChartUIConfig;
  /** Resolved data. In Comparison Mode each series entry also carries the prior
   *  window inline as `comparisonSlots` (drives the ▲/▼ deviation overlay) — no
   *  separate comparisonData prop. */
  data?: DataEntry[];
  onEvent: (event: WidgetEvent) => void;
  timeConfig?: TimeConfig;
  /** Host sets this while the engine is resolving data, to suppress the
   *  "Data not available" state until the first resolve completes. */
  loading?: boolean;
  /** Same as `loading`, but the name the host passes while a GTP-driven
   *  re-resolve is in flight (e.g. the linked Global Time Picker's duration
   *  changed). Treated identically to `loading`. */
  loader?: boolean;
  /** Host sets this when data resolution failed (network/engine error), to
   *  render the "Something went wrong" state. */
  error?: boolean | string;
}

// Safe fallback so the widget renders its empty state (rather than crashing)
// when the host mounts it before the envelope/config has resolved.
const EMPTY_UI_CONFIG: ColumnChartUIConfig = {
  title: '',
  charts: [],
  style: {
    card: { wrapInCard: false, bg: '' },
    stacked: false,
    showLegend: true,
    showDataLabels: false,
    yAxisUnit: '',
  },
};

type Periodicity = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';
const ALL_PERIODICITIES: Periodicity[] = ['Hourly', 'Daily', 'Weekly', 'Monthly'];
const LEVEL_ORDER: Periodicity[] = ['Monthly', 'Weekly', 'Daily', 'Hourly'];

// Per-category plot width (px) used to scale the SDK chart's scrollableMinWidth
// when the Style-tab "Scroll" toggle is on. The SDK default (800px) is narrower
// than the widget, so it never scrolls; scaling by category count makes many
// bars overflow the viewport and produce a horizontal scrollbar.
const SCROLL_MIN_PX_PER_CATEGORY = 56;

interface DrillEntry { label: string; startTime: number; endTime: number; }

// A series is "bound" when its unsPath is a `{{ }}` binding — i.e. it expects
// data from the engine. Used to tell a true loading state (bound series, data
// not arrived yet) apart from an unconfigured one. Mirrors LineChart/ColumnChart.
function isBound(binding?: string): boolean {
  return !!binding && /^\{\{.+\}\}$/.test(binding.trim());
}

// Cap the loading spinner: `data.length === 0` alone can't tell "fetch in
// progress" from "fetch resolved empty" (both are []). If the first resolve
// never reaches the widget (binding/routing issue) the spinner would otherwise
// spin forever, so we fall back to the empty state after this window. When data
// arrives later the chart renders regardless. Mirrors LineChart.
const LOADING_TIMEOUT_MS = 15000;

function getAvailablePeriodicities(range: DateRange): Periodicity[] {
  const days = (range.end.getTime() - range.start.getTime()) / 86_400_000;
  if (days <= 2)   return ['Hourly'];
  if (days <= 31)  return ['Hourly', 'Daily'];
  // Quarter-scale windows (e.g. Previous 3 Month) also allow Monthly.
  if (days <= 180) return ['Daily', 'Weekly', 'Monthly'];
  return ['Daily', 'Weekly', 'Monthly'];
}

const MINS_MAP: Record<string, number> = {
  minute: 1, hour: 60, day: 1440, week: 10080, month: 43200, year: 525600,
};

// Ported from GlobalTimePicker.getPresetPeriodicities: the periodicities a
// duration allows. Custom durations carry an explicit list; calendar presets
// have fixed sets; rolling presets derive from their length.
function getPresetPeriodicities(dur: Duration): string[] {
  if (dur.periodicities?.length) return dur.periodicities;
  if (dur.calendarType) {
    switch (dur.calendarType) {
      case 'today':
      case 'yesterday':      return ['hour'];
      case 'current_week':
      case 'previous_week':  return ['hour', 'day'];
      case 'current_month':
      case 'previous_month': return ['day'];
    }
  }
  const mins = (dur.x ?? 1) * (MINS_MAP[dur.xPeriod ?? 'day'] ?? 1440);
  if (mins <= 60)    return ['minute', 'hour'];
  if (mins <= 1440)  return ['hour'];
  if (mins <= 10080) return ['hour', 'day'];
  if (mins <= 43200) return ['day'];
  return ['day', 'month'];
}

const RAW_TO_PERIODICITY: Record<string, Periodicity> = {
  minute: 'Hourly', hour: 'Hourly', hourly: 'Hourly',
  day: 'Daily', daily: 'Daily',
  week: 'Weekly', weekly: 'Weekly',
  month: 'Monthly', monthly: 'Monthly',
};

// Periodicity options for the active duration (mapped to the widget's levels),
// falling back to the range-length heuristic when no duration is selected.
function durationPeriodicities(dur: Duration | undefined, range: DateRange): Periodicity[] {
  if (!dur) return getAvailablePeriodicities(range);
  const mapped = Array.from(
    new Set(getPresetPeriodicities(dur).map((p) => RAW_TO_PERIODICITY[p.toLowerCase()]).filter(Boolean)),
  ) as Periodicity[];
  return mapped.length ? mapped : getAvailablePeriodicities(range);
}

// Comparison-period counterpart of getSeriesData: the prior window rides INLINE
// on the SAME data entry as `comparisonSlots` (present only when Comparison Mode
// sent a comparison window), passed through by getSeriesData — no separate
// comparisonData array. Comparison-slot labels can be blank, so backfill from
// the same-index current slot (equal bucket count) for the tooltip's "vs <date>"
// footer. Returns null when the entry carries no comparison slots.
function getComparisonSeriesData(key: string, data: DataEntry[]): SeriesPayload | null {
  const current = getSeriesData(key, data);
  if (!current || !Array.isArray(current.comparisonSlots)) return null;
  const slots = current.comparisonSlots.map((s, i) => ({
    ...s,
    label: s.label || current.slots[i]?.label || '',
  }));
  return {
    __type: 'series',
    path: current.path,
    meta: current.meta,
    range: current.range,
    slots,
  };
}

function nextFinerPeriodicity(p: Periodicity): Periodicity {
  const idx = LEVEL_ORDER.indexOf(p);
  return idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : p;
}

// The coarsest (highest-order) periodicity present in `list`. LEVEL_ORDER runs
// coarsest → finest (Monthly … Hourly), so the first match is the highest-order
// option — used as the local picker's default so a window opens at e.g. Daily,
// not Hourly, when both are available.
function coarsestAvailable(list: Periodicity[]): Periodicity | undefined {
  return LEVEL_ORDER.find((p) => list.includes(p));
}

// The periodicity a duration + range opens at: ALWAYS the coarsest (highest-
// order) option it offers. Switching to a new duration resets to this even when
// the previous selection would still be valid — e.g. on Daily, switching to a
// 3-month window (Monthly/Weekly/Daily) snaps UP to Monthly, not stays on Daily;
// switching to a Year window snaps Hourly → Monthly. Only the user's own
// dropdown pick (handlePeriodicityChange) holds a finer cadence. `current` is
// just the fallback when the duration/range offers no options at all.
function periodicityForDuration(
  dur: Duration | undefined,
  range: DateRange,
  current: Periodicity,
): Periodicity {
  return coarsestAvailable(durationPeriodicities(dur, range)) ?? current;
}

function fontWeightToCss(weight: WidgetFontWeight): number {
  switch (weight) {
    case 'Regular':
      return 400;
    case 'Medium':
      return 500;
    case 'Semi-Bold':
      return 600;
    case 'Bold':
      return 700;
    default:
      return 600;
  }
}

function chartColorFallback(color: string | undefined): string | undefined {
  if (!color) return undefined;
  if (color.includes('text-default-primary')) {
    return '#1a1a1a';
  }
  return color;
}

const TOOLTIP_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatTooltipDate(ts: number): string {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, '0');
  const mmm = TOOLTIP_MONTHS[d.getMonth()];
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd} ${mmm} ${yyyy} ${hh}:${mi}`;
}
// Human date for a bucket's [from, to) window, inferring granularity from the
// span so the tooltip shows real DATES instead of coarse bucket labels ("Week 1",
// "Month 3"):
//   • sub-daily (span < ~1 day) → "DD MMM YYYY HH:mm" (the bucket start)
//   • daily (~1 day)            → "DD MMM YYYY"
//   • weekly / monthly+ (>1 day)→ "DD MMM YYYY - DD MMM YYYY" (to is exclusive,
//                                  so the end shows to-1 = the last included day)
function formatTooltipBucket(from: number, to: number): string {
  const DAY = 24 * 3600 * 1000;
  const span = to - from;
  const date = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getDate()).padStart(2, '0')} ${TOOLTIP_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };
  if (span > 0 && span < 0.95 * DAY) return formatTooltipDate(from);
  if (span <= 1.5 * DAY) return date(from);
  return `${date(from)} - ${date(to - 1)}`;
}

// ── Per-chart data builder ────────────────────────────────────────────────────

type DashStyle = 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'LongDash' | 'ShortDash';
// Per-series render type — Combiner supports mixed column/line series.
type SeriesRenderType = 'column' | 'line';

interface ChartDisplayData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvedSeries: { name: string; data: any[]; color?: string; yAxis?: number; type?: SeriesRenderType }[];
  resolvedSeriesIds: string[];
  categories: string[];
  plotLines: { value: number; label?: string; color?: string; width?: number; dashStyle?: DashStyle }[];
  plotBands: { from: number; to: number; label?: string; color?: string }[];
  yAxisUnit: string | undefined;
  firstPayload: SeriesPayload | null;
  highchartsOptions: Record<string, unknown>;
}

type PlotLineOut = { value: number; label?: string; color?: string; width?: number; dashStyle?: DashStyle; yAxis?: 0 | 1 };
type PlotBandOut = { from: number; to: number; label?: string; color?: string; yAxis?: 0 | 1 };

// Build resolved plot lines + bands for a chart, in the SDK's ChartPlotLine /
// ChartPlotBand shape. Shared by the normal, shift and comparison render paths
// so plot lines/bands appear in EVERY view mode — not just normal.
function buildPlotLinesBands(
  chart: ChartConfig,
  ci: number,
  data: DataEntry[],
  config: ColumnChartUIConfig,
  effectivePeriodicity: Periodicity,
): { plotLines: PlotLineOut[]; plotBands: PlotBandOut[] } {
  const resolveNumeric = (key: string, fallback: number | string): number | null => {
    let raw: string | number | null = getValue(key, config, data);
    // A plot-line / plot-band value bound to a UNS topic can resolve to a SERIES
    // (e.g. a `lastdp` topic returns slots, not a scalar) — getValue returns null
    // for series entries. Take the latest non-null slot value as the scalar so
    // the line/band actually plots instead of being dropped.
    if (raw === null) {
      const series = getSeriesData(key, data);
      if (series) {
        for (let i = series.slots.length - 1; i >= 0; i--) {
          const v = series.slots[i]?.value;
          if (v != null) { raw = v; break; }
        }
      }
    }
    const src = raw ?? fallback;
    const n = typeof src === 'number' ? src : parseFloat(String(src));
    return isNaN(n) ? null : n;
  };

  // A plot line/band can be pinned to the Right axis (yAxis 1), but only when
  // the chart actually has one — otherwise it folds back onto the Left axis.
  const chartHasRightAxis = (chart.axes ?? []).some((a) => a.yAxis === 1);
  const plotAxisOf = (y?: 0 | 1): 0 | 1 => (chartHasRightAxis && y === 1 ? 1 : 0);

  const currentPeriodicity = effectivePeriodicity.toLowerCase();
  const plotLines = (chart.plotLines ?? [])
    .map((p, i) => {
      // A plot line scoped to specific periodicities (a "dependent" line)
      // renders ONLY when the current periodicity is one of them. Key off the
      // periodicities LIST rather than `periodicityType`: the configurator
      // clears periodicities whenever the line is Independent, so a non-empty
      // list unambiguously means "scope to these" — and this stays correct even
      // if `periodicityType` is missing or mismatched in older saved data
      // (which was the cause of a dependent line rendering at every periodicity).
      const deps = p.periodicities ?? [];
      if (deps.length > 0 && !deps.some((x) => x.toLowerCase() === currentPeriodicity)) {
        return null;
      }
      const v = resolveNumeric(`charts[${ci}].plotLines[${i}].value`, p.value);
      if (v === null) return null;
      return { value: v, label: p.label || undefined, color: p.color || undefined,
        ...(p.width !== undefined ? { width: p.width } : {}),
        // Default to a solid line so the rendered style matches the
        // configurator default ("Solid"). The SDK otherwise defaults to Dash.
        dashStyle: (p.dashStyle ?? 'Solid') as DashStyle,
        yAxis: plotAxisOf(p.yAxis) };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const plotBands = (chart.plotBands ?? [])
    .map((p, i) => {
      const from = resolveNumeric(`charts[${ci}].plotBands[${i}].from`, p.from);
      const to   = resolveNumeric(`charts[${ci}].plotBands[${i}].to`,   p.to);
      if (from === null || to === null || to <= from) return null;
      return { from, to, label: p.label || undefined, color: p.color || undefined, yAxis: plotAxisOf(p.yAxis) };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return { plotLines, plotBands };
}

// Highcharts-native plot line/band converters (shared by the normal + combo
// axis builders). Mirror the defaults the design-sdk charts apply to their own
// `plotLines`/`plotBands` props, so a plot line/band looks identical whether it
// rides a prop (single axis) or a yAxis-array entry (multi axis).
function toHcPlotLine(p: PlotLineOut) {
  return {
    value: p.value,
    color: p.color ?? '#ef4444',
    width: p.width ?? 2,
    dashStyle: p.dashStyle ?? 'Solid',
    zIndex: 5,
    ...(p.label ? { label: { text: p.label, align: 'right', style: { color: p.color ?? '#ef4444' } } } : {}),
  };
}
function toHcPlotBand(p: PlotBandOut) {
  return {
    from: p.from,
    to: p.to,
    color: p.color ?? 'rgba(239,68,68,0.1)',
    zIndex: 0,
    ...(p.label ? { label: { text: p.label, align: 'right' } } : {}),
  };
}

// Per-source axis index (0 Left / 1 Right) from the chart's axis config — first
// axis that lists a series wins (mirrors buildChartDisplayData's axisBySeriesId).
// Shared by the shift / comparison / combo-axis builders so a source lands on the
// same axis in every view mode.
function axisIndexMap(chart: ChartConfig): Map<string, 0 | 1> {
  const m = new Map<string, 0 | 1>();
  (chart.axes ?? []).forEach((axis) => {
    (axis.seriesIds ?? []).forEach((sid) => {
      if (!m.has(sid)) m.set(sid, axis.yAxis);
    });
  });
  return m;
}

// SHIFT / COMPARISON right-axis support. Since design-sdk 0.7.35 the shift /
// comparison series carry a per-series `yAxis` (ShiftSeriesMeta.yAxis, honored by
// the encoders); buildChartShift / buildChartComparison stamp it per source. This
// builds the matching TWO-ENTRY `highchartsOptions.yAxis` array (the axes
// themselves): Highcharts.merge replaces the SDK's single-object yAxis, creating
// the Right axis, with plot lines/bands split onto the axis the user chose (they
// ride the array because the SDK's plotLines/plotBands props land on the object
// the array replaces). Returns null when the chart has no Right axis — the caller
// then uses the plain plotLines/plotBands props path (single axis).
function buildComboAxes(
  chart: ChartConfig,
  yAxisUnit: string,
  plotLines: PlotLineOut[],
  plotBands: PlotBandOut[],
): { highchartsOptions: Record<string, unknown> } | null {
  const chartHasRightAxis = (chart.axes ?? []).some((a) => a.yAxis === 1);
  if (!chartHasRightAxis) return null;

  const axisMap = axisIndexMap(chart);
  // Right axis is visible only when a series actually sits on it (mirrors the
  // normal path's `visible: hasRightAxis`).
  const rightHasSeries = chart.series.some((s) => axisMap.get(s._id) === 1);

  const leftAxisName  = (chart.axes ?? []).find((a) => a.yAxis === 0)?.name?.trim();
  const rightAxisName = (chart.axes ?? []).find((a) => a.yAxis === 1)?.name?.trim();
  const hcLinesLeft  = plotLines.filter((p) => p.yAxis !== 1).map(toHcPlotLine);
  const hcLinesRight = plotLines.filter((p) => p.yAxis === 1).map(toHcPlotLine);
  const hcBandsLeft  = plotBands.filter((p) => p.yAxis !== 1).map(toHcPlotBand);
  const hcBandsRight = plotBands.filter((p) => p.yAxis === 1).map(toHcPlotBand);

  // Mirror the normal path's yAxisBase: Left stays visible (it's the base axis),
  // Right sits opposite. Plot lines/bands are split onto the axis the user chose.
  const yAxis = [
    {
      title: { text: leftAxisName || yAxisUnit || '' },
      visible: true,
      ...(hcLinesLeft.length ? { plotLines: hcLinesLeft } : {}),
      ...(hcBandsLeft.length ? { plotBands: hcBandsLeft } : {}),
    },
    {
      title: { text: rightAxisName || '' },
      opposite: true,
      visible: rightHasSeries,
      ...(hcLinesRight.length ? { plotLines: hcLinesRight } : {}),
      ...(hcBandsRight.length ? { plotBands: hcBandsRight } : {}),
    },
  ];

  return { highchartsOptions: { yAxis } };
}

function buildChartDisplayData(
  chart: ChartConfig,
  ci: number,
  data: DataEntry[],
  config: ColumnChartUIConfig,
  effectivePeriodicity: Periodicity,
  // Runtime "Data Label" toggle. Threaded in so LINE series get data labels too:
  // the SDK's showDataLabels prop only enables the column plotOptions, so line
  // labels stay off unless we explicitly enable them here.
  showDataLabels: boolean,
): ChartDisplayData {
  const firstPayload = chart.series.reduce<SeriesPayload | null>((acc, _, i) => {
    if (acc) return acc;
    return getSeriesData(`charts[${ci}].series[${i}].unsPath`, data);
  }, null);

  const timeCategories = firstPayload ? firstPayload.slots.map((s) => s.label) : [];
  const yAxisUnit = config.style.yAxisUnit || undefined;
  const axisBySeriesId = new Map<string, { name: string; yAxis: 0 | 1 }>();
  (chart.axes ?? []).forEach((axis) => {
    axis.seriesIds.forEach((seriesId) => {
      if (!axisBySeriesId.has(seriesId)) {
        axisBySeriesId.set(seriesId, { name: axis.name, yAxis: axis.yAxis });
      }
    });
  });

  const fixedValues = chart.fixedSeries.map((_, fi) => {
    const raw = getValue(`charts[${ci}].fixedSeries[${fi}].unsPath`, config, data);
    return typeof raw === 'number' ? raw : (raw !== null ? parseFloat(String(raw)) || null : null);
  });

  const activeFixed = chart.fixedSeries.filter((_, fi) => fixedValues[fi] !== null);
  const categories = [
    ...timeCategories,
    ...activeFixed.map((f, fi) => f.label || `Fixed ${fi + 1}`),
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedSeries: { name: string; data: any[]; color?: string; yAxis?: number; type?: SeriesRenderType }[] =
    chart.series.map((s, i) => {
      const payload = getSeriesData(`charts[${ci}].series[${i}].unsPath`, data);
      const timeValues: (number | null)[] = payload
        ? payload.slots.map((slot) => slot.value ?? 0)
        : new Array(timeCategories.length).fill(null);
      return {
        name: s.label || `Series ${i + 1}`,
        data: [...timeValues, ...activeFixed.map(() => null)],
        ...(s.color ? { color: s.color } : {}),
        yAxis: axisBySeriesId.get(chart.series[i]._id)?.yAxis ?? s.yAxis ?? 0,
        type: s.chartType === 'Line' ? 'line' : 'column',
      };
    });

  const activeFixedValues = chart.fixedSeries.map((_, idx) => fixedValues[idx]).filter((v) => v !== null);
  activeFixed.forEach((f, fi) => {
    resolvedSeries.push({
      name: f.label || `Fixed ${fi + 1}`,
      data: [
        ...new Array(timeCategories.length).fill(null),
        ...activeFixed.map((_, j) => (j === fi ? (activeFixedValues[fi] ?? 0) : null)),
      ],
      ...(f.color ? { color: f.color } : {}),
      yAxis: axisBySeriesId.get(f._id)?.yAxis ?? f.yAxis ?? 0,
      type: f.chartType === 'Line' ? 'line' : 'column',
    });
  });

  const resolvedSeriesIds = [
    ...chart.series.map((s) => s._id),
    ...activeFixed.map((f) => f._id),
  ];

  // Plot lines + bands — shared with the shift/comparison render paths so they
  // appear in EVERY view mode (see buildPlotLinesBands).
  const { plotLines, plotBands } = buildPlotLinesBands(chart, ci, data, config, effectivePeriodicity);

  // Highcharts-native versions of the plot lines/bands, mirroring the
  // defaults the design-sdk ColumnChart applies to its own `plotLines`/
  // `plotBands` props. Needed because when we hand the SDK an explicit
  // `yAxis` array (multi-axis), Highcharts.merge replaces the SDK's yAxis
  // object — discarding the plot lines/bands it put there. So we inject
  // them directly onto the correct axis entry to survive the merge. Each is
  // split into Left (axis 0) and Right (axis 1) groups so it draws against the
  // scale the user chose.
  const hcPlotLinesLeft  = plotLines.filter((p) => p.yAxis !== 1).map(toHcPlotLine);
  const hcPlotLinesRight = plotLines.filter((p) => p.yAxis === 1).map(toHcPlotLine);
  const hcPlotBandsLeft  = plotBands.filter((p) => p.yAxis !== 1).map(toHcPlotBand);
  const hcPlotBandsRight = plotBands.filter((p) => p.yAxis === 1).map(toHcPlotBand);

  const hasRightAxis = resolvedSeries.some((s) => s.yAxis === 1);
  const hasStacks    = (chart.stacks ?? []).some((st) => st.seriesIds.length > 1);
  const hasAxes      = (chart.axes ?? []).length > 0;
  const hasLineSeries = resolvedSeries.some((s) => s.type === 'line');
  // Mixed column/line rendering also needs an explicit per-series override so
  // each series carries its own `type`.
  const needsSeriesOverride = hasRightAxis || hasStacks || hasAxes || hasLineSeries;

  const leftAxisName = (chart.axes ?? []).find((axis) => axis.yAxis === 0)?.name?.trim();
  const rightAxisName = (chart.axes ?? []).find((axis) => axis.yAxis === 1)?.name?.trim();
  const advancedSettings = config.style.advancedSettings;
  const highchartsOptions: Record<string, unknown> = {};

  const unitBySeriesName = new Map<string, string>();
  const precisionBySeriesName = new Map<string, number>();
  chart.series.forEach((s, i) => {
    const name = s.label || `Series ${i + 1}`;
    if (s.unit) unitBySeriesName.set(name, s.unit);
    if (s.precision !== undefined) precisionBySeriesName.set(name, s.precision);
  });
  const rangeByCategory = new Map<string, { from: number; to: number }>();
  if (firstPayload) {
    firstPayload.slots.forEach((slot) => {
      rangeByCategory.set(slot.label, { from: slot.from, to: slot.to });
    });
  }

  const formatSeriesValue = (seriesName: string, value: unknown): string => {
    if (value === null || value === undefined) return '';
    const precision = precisionBySeriesName.get(seriesName);
    if (typeof value === 'number') {
      return precision !== undefined ? value.toFixed(precision) : String(value);
    }
    return String(value);
  };

  highchartsOptions.tooltip = {
    useHTML: true,
    // Shared: one tooltip lists every series (columns + lines) at the hovered
    // category, so a combined bar+line chart shows all values together.
    shared: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter: function (this: any) {
      // `this.points` is present for shared tooltips; fall back to the single
      // point for safety.
      const points: any[] = this.points ?? (this.point ? [this.point] : []);
      if (points.length === 0) return '';
      const category: string = points[0].point?.category ?? points[0].key ?? this.x;
      const range = rangeByCategory.get(category);
      const rows = points
        .map((p) => {
          const series = p.series;
          const seriesName: string = series.name;
          const unit = unitBySeriesName.get(seriesName) ?? '';
          const formattedValue = formatSeriesValue(seriesName, p.y);
          // Line series get a dash glyph, columns a square — mirrors the chart.
          const glyph = series.type === 'line' || series.type === 'spline' ? '▬' : '■';
          return `<div><span style="color:${series.color}; font-size:var(--font-size-100, 14px);">${glyph}</span> ${seriesName} : <b>${formattedValue}${unit ? ' ' + unit : ''}</b></div>`;
        })
        .join('');
      const dateLine = range
        ? `<div style="margin-top:2px; color:var(--text-gray-secondary, #555); font-size:var(--font-size-50, 12px);">${formatTooltipBucket(range.from, range.to)}</div>`
        : '';
      return `${rows}${dateLine}`;
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataLabelFormatter = function (this: any) {
    return formatSeriesValue(this.series.name, this.y);
  };

  highchartsOptions.plotOptions = {
    column: {
      dataLabels: { enabled: showDataLabels, rotation: -90, verticalAlign: 'top', y: -4, formatter: dataLabelFormatter },
      ...(hasStacks ? { stacking: 'normal' } : {}),
    },
    line: {
      // Explicitly enable line data labels — the SDK only wires up column ones.
      dataLabels: { enabled: showDataLabels, formatter: dataLabelFormatter },
    },
  };

  if (needsSeriesOverride) {
    // The Left axis is the default/base axis and stays visible even when every
    // series has moved to the Right axis — otherwise adding a Right axis makes
    // the Left one disappear. Only the Right axis auto-hides when it holds no
    // series. (Mirrors the ColumnChart/LineChart reference.)
    const rightAxisExists = (chart.axes ?? []).some((a) => a.yAxis === 1) || hasRightAxis;

    const yAxisBase = (hasRightAxis || hasAxes)
      ? [
          {
            title: { text: leftAxisName || yAxisUnit || '' },
            visible: true,
            ...(hcPlotLinesLeft.length > 0 ? { plotLines: hcPlotLinesLeft } : {}),
            ...(hcPlotBandsLeft.length > 0 ? { plotBands: hcPlotBandsLeft } : {}),
          },
          ...(rightAxisExists
            ? [{
                title: { text: rightAxisName || '' },
                opposite: true,
                visible: hasRightAxis,
                // Plot lines/bands the user pinned to the Right axis draw here.
                ...(hcPlotLinesRight.length > 0 ? { plotLines: hcPlotLinesRight } : {}),
                ...(hcPlotBandsRight.length > 0 ? { plotBands: hcPlotBandsRight } : {}),
              }]
            : []),
        ]
      : undefined;

    if (yAxisBase) {
      highchartsOptions.yAxis = yAxisBase;
    }

    highchartsOptions.series = resolvedSeries.map((s, idx) => {
      const originalId = resolvedSeriesIds[idx];
      const stack = (chart.stacks ?? []).find((st) => st.seriesIds.includes(originalId));
      const seriesType: SeriesRenderType = s.type || 'column';
      return {
        type: seriesType,
        name: s.name,
        data: s.data,
        ...(s.color ? { color: s.color } : {}),
        yAxis: s.yAxis ?? 0,
        // Stacking only applies to column series.
        ...(stack?.name && seriesType === 'column' ? { stack: stack.name } : {}),
      };
    });
  }

  if (advancedSettings?.enabled) {
    highchartsOptions.xAxis = {
      ...(highchartsOptions.xAxis as Record<string, unknown> | undefined),
      labels: {
        ...(chartColorFallback(advancedSettings.xAxisTextColor) ? { style: { color: chartColorFallback(advancedSettings.xAxisTextColor) } } : {}),
      },
      ...(chartColorFallback(advancedSettings.xAxisLineColor) ? { lineColor: chartColorFallback(advancedSettings.xAxisLineColor), tickColor: chartColorFallback(advancedSettings.xAxisLineColor) } : {}),
    };

    if (highchartsOptions.yAxis && Array.isArray(highchartsOptions.yAxis)) {
      highchartsOptions.yAxis = (highchartsOptions.yAxis as Array<Record<string, unknown>>).map((axis, index) => ({
        ...axis,
        labels: {
          ...(index === 0 && chartColorFallback(advancedSettings.yAxisTextColor) ? { style: { color: chartColorFallback(advancedSettings.yAxisTextColor) } } : {}),
          ...(index === 1 && chartColorFallback(advancedSettings.yAxisTextColor) ? { style: { color: chartColorFallback(advancedSettings.yAxisTextColor) } } : {}),
        },
        ...(chartColorFallback(advancedSettings.gridLineColor) ? { gridLineColor: chartColorFallback(advancedSettings.gridLineColor) } : {}),
      }));
    } else {
      highchartsOptions.yAxis = {
        ...(highchartsOptions.yAxis as Record<string, unknown> | undefined),
        labels: {
          ...(chartColorFallback(advancedSettings.yAxisTextColor) ? { style: { color: chartColorFallback(advancedSettings.yAxisTextColor) } } : {}),
        },
        ...(chartColorFallback(advancedSettings.gridLineColor) ? { gridLineColor: chartColorFallback(advancedSettings.gridLineColor) } : {}),
      };
    }

    highchartsOptions.legend = {
      itemStyle: {
        ...(chartColorFallback(advancedSettings.legendTextColor) ? { color: chartColorFallback(advancedSettings.legendTextColor) } : {}),
      },
      itemHoverStyle: {
        ...(chartColorFallback(advancedSettings.legendTextColor) ? { color: chartColorFallback(advancedSettings.legendTextColor) } : {}),
      },
    };
  }

  return { resolvedSeries, resolvedSeriesIds, categories, plotLines, plotBands, yAxisUnit, firstPayload, highchartsOptions };
}

// ── Time-config → date-picker mapping ──────────────────────────────────────────

interface InitialTime {
  range: DateRange;
  presetId: string;
  presetLabel: string;
}

// Derive the date-picker range + label from the widget's time config so the
// configured default duration is reflected on load. Mirrors the mini-engine's
// computeWindow so the picker matches the data window that gets fetched.
function initialTimeFromConfig(timeConfig?: TimeConfig): InitialTime {
  const fallback = (): InitialTime => {
    const r = getPresetDateRange('previous_7_days');
    return {
      range: r ?? { start: new Date(Date.now() - 7 * 86_400_000), end: new Date() },
      presetId: 'previous_7_days',
      presetLabel: 'Past 7 days',
    };
  };
  if (!timeConfig) return fallback();
  // Fixed picker: resolve its single "set duration" (x/xEvent/xPeriod + y…).
  if (timeConfig.pickerType === 'fixed' && timeConfig.fixedDuration) {
    const { startTime, endTime } = resolveDurationWindow(timeConfig.fixedDuration, Date.now(), timeConfig.cycleTime);
    return {
      range: { start: new Date(startTime), end: new Date(endTime) },
      presetId: timeConfig.fixedDuration.id,
      presetLabel: timeConfig.fixedDuration.label || 'Fixed',
    };
  }
  // Legacy absolute fixed window.
  if (timeConfig.type === 'fixed' && timeConfig.startTime && timeConfig.endTime) {
    return {
      range: { start: new Date(timeConfig.startTime), end: new Date(timeConfig.endTime) },
      presetId: 'custom',
      presetLabel: 'Fixed range',
    };
  }
  const dur = timeConfig.allDurations?.find((d) => d.id === timeConfig.defaultDurationId);
  if (!dur) return fallback();
  const { startTime, endTime } = resolveDurationWindow(dur, Date.now(), timeConfig.cycleTime);
  return {
    range: { start: new Date(startTime), end: new Date(endTime) },
    presetId: dur.id,
    presetLabel: dur.label || dur.id,
  };
}

// Labels for the design-sdk DatePicker's built-in presets (mirrors its
// internal label map) so the duration text stays readable when the user
// picks a preset from the date picker itself.
const DATEPICKER_PRESET_LABELS: Record<string, string> = {
  custom: 'Custom',
  today: 'Today',
  yesterday: 'Yesterday',
  current_week: 'Current Week',
  previous_7_days: 'Past 7 days',
  current_month: 'Current Month',
  previous_month: 'Previous Month',
  previous_3_month: 'Previous 3 Month',
  previous_12_month: 'Previous 12 Month',
  current_year: 'Current Year',
  previous_year: 'Previous Year',
};

// The SDK DatePicker's 11 built-in presets, defined locally (DEFAULT_PRESETS is
// not re-exported from the DatePicker subpath). Only id+label are needed for the
// picker list; the WINDOW is resolved by the SDK's `getPresetDateRange`, and the
// periodicity follows the SDK's RANGE heuristic (`getAvailablePeriodicities`)
// since these aren't matched as configured durations — so the available
// periodicities adapt to each preset's actual resolved length:
//   ≤2d → Hourly · ≤31d → Hourly,Daily · ≤180d → Daily,Weekly · else → Daily,Weekly,Monthly.
const BUILTIN_PRESETS: Array<{ id: string; label: string }> = [
  { id: 'today',             label: 'Today' },
  { id: 'yesterday',         label: 'Yesterday' },
  { id: 'current_week',      label: 'Current Week' },
  { id: 'previous_7_days',   label: 'Past 7 days' },
  { id: 'current_month',     label: 'Current Month' },
  { id: 'previous_month',    label: 'Previous Month' },
  { id: 'previous_3_month',  label: 'Previous 3 Month' },
  { id: 'previous_12_month', label: 'Previous 12 Month' },
  { id: 'current_year',      label: 'Current Year' },
  { id: 'previous_year',     label: 'Previous Year' },
];

function periodicityFromConfig(timeConfig?: TimeConfig): Periodicity {
  switch (timeConfig?.defaultPeriodicity) {
    case 'minute':
    case 'hourly':  return 'Hourly';
    case 'weekly':  return 'Weekly';
    case 'monthly': return 'Monthly';
    case 'daily':   return 'Daily';
    default:        return 'Daily';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

type DeviationPattern = 'green-up-positive' | 'red-up-positive';

// Build the per-source current/comparison values for one chart, aligned by
// category index (the comparison window has the same bucket count).
function buildChartComparison(
  chart: ChartConfig,
  ci: number,
  data: DataEntry[],
  // Per-source deviation polarity overrides keyed by `${chartId}:${sourceId}`
  // (Advanced Settings → per-source indicator). Undefined when the feature is
  // off, in which case every series falls back to the chart-wide pattern.
  perSourceOverrides?: Record<string, DeviationPattern>,
): { sources: ComparisonSourceData[]; categories: string[]; comparisonCategories: string[]; tooltipCategories: string[] } | null {
  const firstPayload = chart.series.reduce<SeriesPayload | null>(
    (acc, _, i) => acc ?? getSeriesData(`charts[${ci}].series[${i}].unsPath`, data),
    null,
  );
  if (!firstPayload || firstPayload.slots.length === 0) return null;
  const categories = firstPayload.slots.map((s) => s.label);
  // Tooltip labels are real DATES (not the coarse "Week 1" x-axis labels) — the
  // SDK's tooltipCategories override the tooltip text while the axis keeps the
  // compact labels.
  const tooltipCategories = firstPayload.slots.map((s) => formatTooltipBucket(s.from, s.to));
  const n = categories.length;

  // Comparison-period bucket dates (same index alignment) — drive the tooltip's
  // "vs <date>" footer. Read from each entry's inline `comparisonSlots`; falls
  // back to the current dates if the window is absent.
  const firstCmpPayload = chart.series.reduce<SeriesPayload | null>(
    (acc, _, i) => acc ?? getComparisonSeriesData(`charts[${ci}].series[${i}].unsPath`, data),
    null,
  );
  const comparisonCategories = firstCmpPayload
    ? firstCmpPayload.slots.map((s) => formatTooltipBucket(s.from, s.to))
    : tooltipCategories;

  // Per-source axis binding (0.7.35+): buildComparisonSeries propagates
  // ComparisonSourceData.yAxis onto BOTH the current and comparison series, so a
  // Right-axis source plots against the Right axis in comparison mode too. Only
  // stamped when the chart actually has a Right axis (else every source stays on
  // the single default axis).
  const chartHasRightAxis = (chart.axes ?? []).some((a) => a.yAxis === 1);
  const axisMap = axisIndexMap(chart);

  const sources: ComparisonSourceData[] = chart.series.map((s, i) => {
    const cur = getSeriesData(`charts[${ci}].series[${i}].unsPath`, data);
    const cmp = getComparisonSeriesData(`charts[${ci}].series[${i}].unsPath`, data);
    const current    = cur ? cur.slots.map((slot) => slot.value ?? null) : new Array(n).fill(null);
    const comparison = cmp ? cmp.slots.map((slot) => slot.value ?? null) : new Array(n).fill(null);
    // Per-source polarity override wins over the chart-wide default (the SDK's
    // buildComparisonSeries honors ComparisonSourceData.deviationPattern first).
    const override = perSourceOverrides?.[`${chart._id}:${s._id}`];
    return {
      id: s._id,
      name: s.label || `Series ${i + 1}`,
      current,
      comparison,
      ...(s.color ? { color: s.color } : {}),
      ...(override ? { deviationPattern: override } : {}),
      seriesType: (s.chartType === 'Line' ? 'line' : 'column') as 'line' | 'column',
      ...(chartHasRightAxis ? { yAxis: axisMap.get(s._id) ?? 0 } : {}),
    };
  });
  return { sources, categories, comparisonCategories, tooltipCategories };
}

// Aggregator label → resolveAndCompute operator (mirrors the working ColumnChart
// widget). The shift roll-up operator must be a real operator name, not a UI
// label, or the backend can misinterpret the request.
const SHIFT_AGGREGATOR_OPERATOR: Record<string, string> = {
  sum: 'sum', average: 'mean', mean: 'mean', min: 'min', max: 'max', first: 'first', last: 'last',
};
function shiftAggregatorOperator(label?: string): string | undefined {
  if (!label) return undefined;
  return SHIFT_AGGREGATOR_OPERATOR[label.toLowerCase()] ?? label.toLowerCase();
}

// Time-of-day (0–1439 minutes) for a Unix-ms timestamp, honoring the configured
// timezone (falls back to browser-local). Copied from the working ColumnChart.
function slotMinutesOfDay(timestampMs: number, timezone?: string): number {
  if (timezone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: false,
      }).formatToParts(new Date(timestampMs));
      const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24;
      const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
      return h * 60 + m;
    } catch { /* fall through to local */ }
  }
  const d = new Date(timestampMs);
  return d.getHours() * 60 + d.getMinutes();
}

// True when a slot's time-of-day falls inside a shift window (handles night
// shifts that cross midnight). `from` may arrive in seconds or ms — normalise.
function isSlotInShift(from: number, startTime: string, endTime: string, timezone?: string): boolean {
  const ms = from < 1e12 ? from * 1000 : from;
  const slotMin = slotMinutesOfDay(ms, timezone);
  const [sh, sm = 0] = startTime.split(':').map(Number);
  const [eh, em = 0] = endTime.split(':').map(Number);
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  return s < e ? slotMin >= s && slotMin < e : slotMin >= s || slotMin < e;
}

// Shift-mode series for one chart. A bucket's value is assigned to the shift whose
// backend `slot.shift` tag matches — OR, when the backend didn't tag (our engine
// currently doesn't), the shift whose time-of-day window contains the bucket
// (`isSlotInShift`), mirroring the working ColumnChart. Every source × enabled
// shift becomes one ShiftSeriesInput. `seriesType` keeps combo
// sources drawing as columns (bars) or lines exactly as configured. Returns null
// when there is no data or no enabled shift to draw.
function buildChartShift(
  chart: ChartConfig,
  ci: number,
  data: DataEntry[],
  cfgShifts: Array<{ id: string; name: string; startTime: string; endTime: string; color: string }>,
  enabledShiftIds: Set<string>,
  subDaily: boolean,
  onToggleShift: (id: string) => void,
  tz?: string,
): { shift: ChartShiftConfig; categories: string[]; tooltipCategories: string[] } | null {
  const firstPayload = chart.series.reduce<SeriesPayload | null>(
    (acc, _, i) => acc ?? getSeriesData(`charts[${ci}].series[${i}].unsPath`, data),
    null,
  );
  if (!firstPayload || firstPayload.slots.length === 0) return null;
  // The backend returns one bucket per (bucket × shift): at Daily+ every day
  // carries a value for EVERY shift, so the same day label repeats once per
  // shift. Collapse to UNIQUE labels (in order) — that is the real x-axis; each
  // shift then becomes one full line across all days. At sub-daily each label
  // already appears once (a bucket belongs to a single shift), so this is a
  // no-op there.
  const categories: string[] = [];
  // Tooltip labels are real DATES (not the coarse "Week 1" x-axis labels).
  const tooltipCategories: string[] = [];
  const seenLabel = new Set<string>();
  for (const slot of firstPayload.slots) {
    if (!seenLabel.has(slot.label)) {
      seenLabel.add(slot.label);
      categories.push(slot.label);
      tooltipCategories.push(formatTooltipBucket(slot.from, slot.to));
    }
  }

  // Per-source axis binding (0.7.35+): each ShiftSeriesInput carries a `yAxis`
  // (honored by toComboSeries) so a Right-axis source's shift series plot against
  // the Right axis. Only stamped when the chart has a Right axis.
  const chartHasRightAxis = (chart.axes ?? []).some((a) => a.yAxis === 1);
  const axisMap = axisIndexMap(chart);

  const out: Array<ShiftSeriesInput & { seriesType: 'line' | 'column' }> = [];
  chart.series.forEach((s, si) => {
    const payload = getSeriesData(`charts[${ci}].series[${si}].unsPath`, data);
    const slots = payload?.slots ?? [];
    // Index this source's values by `${label} ${shiftName}` so each shift
    // line can pull its value for every day in one lookup. Prefer the backend's
    // per-bucket `slot.shift` tag; when absent (our engine returns untagged
    // buckets) DERIVE the shift from the slot's time-of-day against the
    // configured windows — mirrors the working ColumnChart, so shift renders
    // without depending on the backend tagging.
    const byLabelShift = new Map<string, number | null>();
    for (const slot of slots) {
      const rawTag = typeof slot.shift === 'string' && slot.shift.length > 0 ? slot.shift : undefined;
      // Normalise the backend tag to a shift NAME — it may arrive as the shift
      // name OR its id. Match either.
      let shiftName = rawTag
        ? cfgShifts.find((sh) => sh.name === rawTag || sh.id === rawTag)?.name
        : undefined;
      // No tag, or an unrecognised tag → derive from the slot's time-of-day
      // (never drop the value just because the tag did not match a known shift).
      if (!shiftName && slot.from != null) {
        shiftName = cfgShifts.find((sh) => isSlotInShift(slot.from as number, sh.startTime, sh.endTime, tz))?.name;
      }
      if (shiftName) {
        byLabelShift.set(`${slot.label} ${shiftName}`, slot.value ?? null);
      }
    }
    const seriesType: 'line' | 'column' = s.chartType === 'Line' ? 'line' : 'column';
    const sYAxis = chartHasRightAxis ? (axisMap.get(s._id) ?? 0) : undefined;
    cfgShifts.forEach((shift, shIdx) => {
      if (!enabledShiftIds.has(shift.id)) return;
      out.push({
        sourceId: s._id,
        sourceName: s.label || `Series ${si + 1}`,
        sourceIndex: si,
        shiftId: shift.id,
        shiftName: shift.name,
        shiftIndex: shIdx,
        shiftColor: shift.color,
        seriesType,
        ...(sYAxis !== undefined ? { yAxis: sYAxis } : {}),
        data: categories.map((label, li) => {
          // This shift's value for the day (Daily: present for every day → one
          // full line per shift; sub-daily: present only where the bucket is
          // this shift).
          const key = `${label} ${shift.name}`;
          if (byLabelShift.has(key)) return byLabelShift.get(key) ?? null;
          // Sub-daily boundary bridge: contiguous time-of-day blocks join into
          // one line by repeating the previous bucket's value at the first
          // bucket of the next shift's run.
          if (subDaily) {
            const prev = categories[li - 1];
            const prevKey = prev !== undefined ? `${prev} ${shift.name}` : '';
            if (byLabelShift.has(prevKey)) return byLabelShift.get(prevKey) ?? null;
          }
          return null;
        }),
      });
    });
  });
  if (out.length === 0) return null;

  return {
    shift: {
      series: out,
      sources: chart.series.map((s, i) => ({ index: i, name: s.label || `Series ${i + 1}` })),
      shifts: cfgShifts.map((s) => ({
        id: s.id, name: s.name, color: s.color, enabled: enabledShiftIds.has(s.id),
      })),
      onToggleShift,
      onToggleSource: () => {},
    },
    categories,
    tooltipCategories,
  };
}

export function CombinedBarLineChart({ config = EMPTY_UI_CONFIG, data = [], onEvent, timeConfig, loading: loadingProp, loader, error }: CombinedBarLineChartProps) {
  // The host uses `loading` for its own resolves and `loader` for GTP-driven
  // re-resolves — treat either as "loading" so the loading state shows in both.
  const loading = !!loadingProp || !!loader;
  const chartRef = useRef<unknown>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  // True browser fullscreen via the native Fullscreen API on the widget shell —
  // browser chrome gone, nothing but the widget. The date-range + periodicity
  // pickers are HIDDEN in fullscreen (their popovers portal to <body>, which
  // renders under the fullscreen top layer and can't be used), so the header
  // shows just the title + action icons. `isFullscreen` drives both that and the
  // export-menu label; it's tracked from the native fullscreenchange event so it
  // stays correct whether the user exits via the menu or the Esc key.
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  // In fullscreen the SDK's portaled title-truncation Tooltip renders behind the
  // fullscreen top layer (it portals to document.body), so it never shows. Add a
  // native `title` attribute on the truncated title label instead — browser
  // tooltips render on the top layer, so this works in fullscreen. Only while
  // fullscreen (windowed mode uses the SDK's own styled tooltip); removed when
  // the title fits or on exit so there's never a double tooltip.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const apply = () => {
      const el = shell.querySelector<HTMLElement>('.fds-chart__title-label');
      if (!el) return;
      if (isFullscreen && el.scrollWidth > el.clientWidth + 1) {
        el.setAttribute('title', el.textContent ?? '');
      } else {
        el.removeAttribute('title');
      }
    };
    const raf = requestAnimationFrame(apply);
    let ro: ResizeObserver | undefined;
    if (isFullscreen && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(apply);
      ro.observe(shell);
    }
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); };
  }, [isFullscreen, data, config]);

  function handleFullscreen() {
    setExportOpen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => { /* noop */ });
    } else {
      shellRef.current?.requestFullscreen?.().catch(() => { /* user gesture / permission */ });
    }
  }

  const [preset, setPreset] = useState(() => initialTimeFromConfig(timeConfig).presetId);
  const [presetLabel, setPresetLabel] = useState(() => initialTimeFromConfig(timeConfig).presetLabel);
  const [range, setRange] = useState<DateRange>(() => initialTimeFromConfig(timeConfig).range);

  // Date-picker Compare panel. The switch defaults on when the time tab enabled
  // Comparison Mode. compRangeRef holds the latest applied comparison window so
  // emitTimeChange can ride it alongside the main window (the picker fires the
  // main + comparison onChange callbacks separately on Apply).
  const comparisonModeOn = Boolean(timeConfig?.comparisonMode);
  // Shifts configured (in the time tab or inherited from the GTP) → the date
  // picker shows a "Shift" toggle.
  const shiftsConfigured = (timeConfig?.shifts?.length ?? 0) > 0;
  // The time tab's "default view mode" picks the view the widget starts in:
  //   'comparison' → Compare on   ·   'shift' → Shift on   ·   'normal' → neither.
  // When no explicit mode is set (older configs) fall back to the comparisonMode
  // flag so default-compare still works.
  const defaultDisplayMode = timeConfig?.defaultDisplayMode;
  const compareDefault = defaultDisplayMode ? defaultDisplayMode === 'comparison' : comparisonModeOn;
  const shiftDefault = defaultDisplayMode === 'shift' && shiftsConfigured;

  const [compareOn, setCompareOn] = useState(compareDefault);
  // Mirrors compareOn so emitTimeChange (and the toggle handlers) can read the
  // current value before setState flushes, and so every emit carries the
  // EXPLICIT compare state — the engine keys off this rather than the persisted
  // comparisonMode config flag, so toggling Compare off actually drops the
  // comparison view instead of the config default forcing it back on.
  const compareOnRef = useRef(compareDefault);
  // The COMMITTED compare state that drives the render — toggling Compare in the
  // picker only updates compareOn (the switch); the view flips only when the
  // change is APPLIED (emitted on the date picker's Apply/Save, or a config
  // default change). emitTimeChange commits this to compareOnRef.current on every
  // emit, so the chart reflects Compare on Save, not on the toggle.
  const [appliedCompareOn, setAppliedCompareOn] = useState(compareDefault);
  // The COMMITTED shift state that drives the render. Adding a shift in the config
  // must NOT show the shift view unless shift is actually enabled — default view
  // = shift, or the picker's Shift toggle applied. Committed by emitTimeChange on
  // every emit, so it tracks the applied toggle / default.
  const [appliedShiftOn, setAppliedShiftOn] = useState(shiftDefault);
  const [compRange, setCompRange] = useState<ComparisonDateRange | null>(null);
  const compRangeRef = useRef<ComparisonDateRange | null>(null);
  const [shiftOn, setShiftOn] = useState(shiftDefault);
  // Mirrors shiftOn so the Shift toggle handler can emit a TIME_CHANGE before its
  // setState flushes (same trick as compRangeRef for the Compare toggle).
  const shiftOnRef = useRef(shiftDefault);
  // Keep the live toggles in step with the configured default view: when the
  // default display mode (or comparisonMode / shifts) changes in the config,
  // reset the toggles to it so a config save reflects LIVE without a dashboard
  // reload. Fires ONLY when those config values actually flip, so it never
  // clobbers a runtime toggle made against an unchanged config.
  useEffect(() => {
    setCompareOn(compareDefault);
    compareOnRef.current = compareDefault;
    setAppliedCompareOn(compareDefault);
    setShiftOn(shiftDefault);
    shiftOnRef.current = shiftDefault;
    setAppliedShiftOn(shiftDefault);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDisplayMode, comparisonModeOn, shiftsConfigured]);
  // Configured shift windows (from the time tab / GTP) and which of them are
  // currently drawn. The legend chips toggle members of this set client-side —
  // no re-fetch, since all shift buckets already arrived in `slots`.
  // GTP fallback: a GTP-linked widget may not carry the linked picker's shifts in
  // its own persisted config, yet the resolved data is shift-tagged. When config
  // shifts are absent but the data carries `slot.shift` tags, derive the shift
  // list from those tags so buildChartShift still has definitions to split by.
  const cfgShifts = useMemo(() => {
    const fromConfig = timeConfig?.shifts ?? [];
    if (fromConfig.length > 0) return fromConfig;
    const names: string[] = [];
    data.forEach((entry) => {
      (entry.slots ?? []).forEach((sl) => {
        if (typeof sl.shift === 'string' && sl.shift && !names.includes(sl.shift)) names.push(sl.shift);
      });
    });
    if (names.length === 0) return fromConfig;
    const palette = ['#e4553d', '#1364f1', '#0f9d58', '#f4b400', '#9c27b0', '#00acc1'];
    return names.map((name, i) => ({ id: name, name, color: palette[i % palette.length], startTime: '', endTime: '' }));
  }, [timeConfig?.shifts, data]);
  const cfgShiftIdKey = cfgShifts.map((s) => s.id).join('|');
  const [enabledShiftIds, setEnabledShiftIds] = useState<Set<string>>(
    () => new Set(cfgShifts.map((s) => s.id)),
  );
  // Re-enable every shift whenever the configured set changes (config edit / GTP
  // reset), so a newly added shift isn't hidden and a removed one is dropped.
  useEffect(() => {
    setEnabledShiftIds(new Set(cfgShiftIdKey ? cfgShiftIdKey.split('|') : []));
  }, [cfgShiftIdKey]);
  function toggleShift(id: string) {
    setEnabledShiftIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  // Latest main range, kept in a ref so the Compare callback (which fires
  // separately from the main onRangeChange on Apply) always pairs with the
  // current main window instead of a stale render's `range` state.
  const rangeRef = useRef<DateRange>(range);
  // The last TIME_CHANGE we emitted. A date-picker preset selection fires BOTH
  // onPresetSelect and onRangeChange for the same window, so two emits arrive
  // back-to-back; we drop the duplicate here (order-proof, unlike the rangeRef
  // window guard which only works when onPresetSelect wins). Rolling presets
  // (Previous 3/12 Month, Past 7 days) anchor their window to Date.now(), so the
  // two callbacks compute windows a few ms apart — the start/end comparison must
  // therefore be tolerant, not exact (see EMIT_DEDUPE_* below).
  const lastEmitRef = useRef<{ restSig: string; start: number; end: number; time: number } | null>(null);
  // Timestamp of the last preset/range APPLY we emitted (or deferred, below).
  // One picker gesture fires up to THREE SDK callbacks in the same tick —
  // onPresetSelect, then onRangeChange (with the window STAGED when the preset
  // row was clicked, i.e. possibly seconds older than what onPresetSelect just
  // resolved), then onComparisonRangeChange when showComparison is passed. Any
  // onRangeChange landing right after an apply-emit is that stale echo: drop it
  // wholesale, our fresher window already went out.
  const applyEmitAtRef = useRef(0);
  // When comparison mode is configured, the comparison callback is the LAST of
  // the trio and the only one that knows the fresh comparison window — so the
  // apply defers its emit here (stashing the snapped periodicity) and lets that
  // callback send the single, complete TIME_CHANGE.
  const pendingApplyPeriodicityRef = useRef<Periodicity | null>(null);
  // False until after the first paint — gates emitTimeChange so the SDK
  // DatePicker's mount-time onRangeChange/onPresetSelect echoes never emit a
  // TIME_CHANGE. Only user interactions (which all happen post-mount) emit.
  const didMountRef = useRef(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => { didMountRef.current = true; });
    return () => cancelAnimationFrame(id);
  }, []);

  // Periodicity options derive from the active duration (its configured
  // periodicities), like GlobalTimePicker — not from the range length.
  // Built-in presets are intentionally NOT matched here, so a selected built-in
  // leaves `selectedDuration` undefined and `durationPeriodicities` falls back to
  // the SDK's range-length heuristic (getAvailablePeriodicities) — adapting the
  // available periodicities to the preset's actual resolved window.
  const selectedDuration =
    timeConfig?.allDurations?.find((d) => d.id === preset) ??
    (timeConfig?.pickerType === 'fixed' ? timeConfig.fixedDuration : undefined);
  // Memoised so the options array keeps a stable identity between unrelated
  // re-renders — the periodicity-sync effect below keys on it, so a fresh array
  // every render would either thrash or (when keyed on `range` alone) miss an
  // options change that didn't move the range. Recomputes only when the active
  // duration definition or the resolved window actually changes.
  const availablePeriodicities = useMemo(
    () => durationPeriodicities(selectedDuration, range),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(selectedDuration ?? null), range.start.getTime(), range.end.getTime()],
  );
  const [basePeriodicity, setBasePeriodicity] = useState<Periodicity>(() => {
    const configured = periodicityFromConfig(timeConfig);
    const localPicker =
      (timeConfig?.pickerType ?? (timeConfig?.type as TimeConfig['pickerType']) ?? 'local') === 'local';
    // Local picker opens at the coarsest (highest-order) available periodicity —
    // e.g. Daily, not Hourly, when both are offered. Fixed/global stay config-driven.
    return localPicker ? (coarsestAvailable(availablePeriodicities) ?? configured) : configured;
  });
  const [drillPath, setDrillPath] = useState<DrillEntry[]>([]);

  // ── First-load detection ──────────────────────────────────────────────────
  // Show the loading spinner (not the empty / half-filled chart) until the first
  // resolve arrives, whenever the chart has bound series that expect data. This
  // mirrors LineChart: a bound-but-dataless chart reads as "still fetching", not
  // "no data". Capped by LOADING_TIMEOUT_MS so a stuck binding can't spin forever.
  const dataEmpty = data.length === 0;
  const hasBoundSeries = (config.charts ?? []).some((c) =>
    (c.series ?? []).some((s) => isBound(s.unsPath)),
  );
  const [loadingExpired, setLoadingExpired] = useState(false);
  useEffect(() => {
    if (!dataEmpty || !hasBoundSeries) {
      setLoadingExpired(false);
      return;
    }
    setLoadingExpired(false); // fresh fetch (data reference changed) → restart
    const t = setTimeout(() => setLoadingExpired(true), LOADING_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [data, dataEmpty, hasBoundSeries]);
  // Full-screen spinner only on the FIRST load — when there is no data to show
  // yet (host `loading` flag OR an in-flight first resolve), until the cap
  // expires. A refetch while data is already on screen uses the lighter overlay
  // below instead, so the header + time/periodicity controls stay visible.
  const isFirstLoad = !loadingExpired && dataEmpty && (!!loading || hasBoundSeries);

  // Refetch loading state (duration / periodicity change, compare/shift toggle,
  // drilldown). The host's `loading` prop can lag the user's action, so — like
  // ColumnChart — we also flip a LOCAL `refetching` flag the instant we emit a
  // TIME_CHANGE, then clear it once a fresh `data` reference arrives (success OR
  // empty) or a safety timeout fires. This gives immediate feedback while the
  // engine re-resolves, instead of leaving the previous chart on screen.
  const [refetching, setRefetching] = useState(false);
  // The `data` reference captured at emit time — any change from it means the
  // host responded (even an empty array on error is a new reference).
  const dataAtRefetchRef = useRef<DataEntry[] | null>(null);
  useEffect(() => {
    if (!refetching || dataAtRefetchRef.current === null) return;
    if (data === dataAtRefetchRef.current) return; // host hasn't responded yet
    setRefetching(false);
    dataAtRefetchRef.current = null;
  }, [data, refetching]);
  // Safety net: if the host never responds (e.g. no live wiring in a preview),
  // don't hold the overlay up forever.
  useEffect(() => {
    if (!refetching) return;
    const t = setTimeout(() => { setRefetching(false); dataAtRefetchRef.current = null; }, LOADING_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [refetching]);
  // Refetch in progress with data already rendered — time change, periodicity
  // change, compare/shift toggle or drilldown. Drives an overlay over the chart
  // (see the main render) rather than blanking the whole widget.
  const isRefetching = (!!loading || refetching) && !dataEmpty;

  // Settings / Export menus: the SDK DropdownMenu is itself the single menu
  // container (not wrapped in a Popover, which would double-nest). We own the
  // trigger, the open state, the anchor position, and dismissal.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const [periodicityOpen, setPeriodicityOpen] = useState(false);
  // The icon the open menu is anchored to, so we can re-anchor it on scroll.
  const menuTriggerRef = useRef<HTMLElement | null>(null);

  // Position below the icon, right-aligned to it (≈ Popover "Bottom End").
  function menuPosFor(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return { top: rect.bottom + 4, right: Math.max(8, window.innerWidth - rect.right) };
  }

  function openMenu(e: React.MouseEvent, which: 'settings' | 'export') {
    const el = e.currentTarget as HTMLElement;
    menuTriggerRef.current = el;
    setMenuPos(menuPosFor(el));
    if (which === 'settings') { setSettingsOpen((v) => !v); setExportOpen(false); }
    else { setExportOpen((v) => !v); setSettingsOpen(false); }
  }

  // Keep the open menu stuck to its icon while the page/any ancestor scrolls or
  // the window resizes — the menu is position:fixed, so without this it would
  // stay pinned to the viewport as the chart scrolls away. capture:true so a
  // scroll on any scroll container (not just window) triggers a re-anchor.
  useEffect(() => {
    if (!settingsOpen && !exportOpen) return;
    const reanchor = () => {
      if (menuTriggerRef.current) setMenuPos(menuPosFor(menuTriggerRef.current));
    };
    window.addEventListener('scroll', reanchor, true);
    window.addEventListener('resize', reanchor);
    return () => {
      window.removeEventListener('scroll', reanchor, true);
      window.removeEventListener('resize', reanchor);
    };
  }, [settingsOpen, exportOpen]);

  // Dismiss the menus on outside click / Escape.
  useEffect(() => {
    if (!settingsOpen && !exportOpen) return;
    function onDown(ev: MouseEvent) {
      const t = ev.target as HTMLElement;
      if (t.closest('.cc-widget__menu') || t.closest('[aria-label="Chart settings"]') || t.closest('[aria-label="Export chart"]')) return;
      setSettingsOpen(false);
      setExportOpen(false);
    }
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') { setSettingsOpen(false); setExportOpen(false); }
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [settingsOpen, exportOpen]);
  // Which chart is shown in the ChartSwitcher (controlled, so picking a chart
  // from the title dropdown reliably swaps the canvas).
  const [activeChartId, setActiveChartId] = useState<string | undefined>(undefined);

  const [timeDrillDown,   setTimeDrillDown]   = useState(true);
  const [showLegend,      setShowLegend]      = useState(config.style.showLegend);
  const [showDataLabels,  setShowDataLabels]  = useState(config.style.showDataLabels);
  const [clipping,        setClipping]        = useState(false);
  const [zoomable,        setZoomable]        = useState(true);
  // Horizontal scroll is a runtime toggle in the settings dropdown; the
  // Style-tab "Scroll" option only seeds its initial checked/unchecked state.
  // Kept as local state (not derived from config) so toggling it never emits a
  // new envelope / re-resolve — which would drop runtime shift/comparison data.
  const [scrollable,      setScrollable]      = useState(config.style.scroll ?? false);
  const [inexactMultiple, setInexactMultiple] = useState(false);
  const widgetElements = config.style.widgetElements ?? {
    hideWidgetElements: false,
    hideSettingsIcon: false,
    hideExportIcon: false,
    hideChartTitle: false,
    hideInfoIcon: false,
  };
  // With more than one chart the title row IS the chart switcher — hiding it
  // would strip the only way to switch charts. Force it visible in that case
  // (the configurator also disables the "Chart Title" hide option), so an older
  // config saved with hideChartTitle still shows the switcher.
  const hideChartTitle = widgetElements.hideChartTitle && (config.charts?.length ?? 0) <= 1;
  const advancedSettings = config.style.advancedSettings;
  const titleStyleVars = advancedSettings?.enabled
    ? {
        '--cc-widget-title-font-size': `${advancedSettings.titleFontSize}px`,
        '--cc-widget-title-color': advancedSettings.titleFontColor,
        '--cc-widget-title-weight': String(fontWeightToCss(advancedSettings.titleFontWeight)),
        // The SDK renders its OWN HTML legend (not the Highcharts SVG legend),
        // so the Highcharts legend.itemStyle set in buildChartDisplayData never
        // reaches it. Expose the configured colour as a CSS var and apply it to
        // .fds-chart-legend__label via CSS instead.
        ...(advancedSettings.legendTextColor
          ? { '--cc-widget-legend-color': advancedSettings.legendTextColor }
          : {}),
      }
    : {};

  // Wrap-Into-Card styling (Style tab). When wrapInCard is off the chart shows
  // no card chrome (transparent, borderless); when on, the configured
  // background / border colour / width / radius drive the card.
  const card = config.style.card;
  const cardWrapped = card?.wrapInCard ?? true;
  const cardStyleVars = {
    '--cc-card-bg': cardWrapped ? (card?.backgroundColor || 'var(--background-surface-intense, #fff)') : 'transparent',
    '--cc-card-border-color': cardWrapped ? (card?.borderColor || 'var(--border-gray-muted, #e8e8e8)') : 'transparent',
    '--cc-card-border-width': cardWrapped ? `${card?.borderWidth ?? 1}px` : '0px',
    '--cc-card-border-radius': cardWrapped ? `${card?.borderRadius ?? 4}px` : '0px',
  };

  const widgetTitleStyle = { ...titleStyleVars, ...cardStyleVars } as CSSProperties;

  useEffect(() => {
    setShowLegend(config.style.showLegend);
    setShowDataLabels(config.style.showDataLabels);
  }, [config.style.showLegend, config.style.showDataLabels]);

  // The configurator's Scroll option seeds the runtime toggle: re-sync whenever
  // the saved value changes (e.g. the creator flips it in the Style tab).
  useEffect(() => {
    setScrollable(config.style.scroll ?? false);
  }, [config.style.scroll]);

  // Re-sync the date-picker DISPLAY whenever the configured time changes so the
  // picker reflects the configured default. The widget deliberately does NOT
  // emit a TIME_CHANGE here:
  //   • The host already re-resolves data from the new envelope, so emitting
  //     would fire a redundant second request (and a stale-override fetch in
  //     between).
  //   • In fixed/global mode the window is externally owned — a widget emit
  //     would push a local override that wrongly shadows it.
  // TIME_CHANGE is emitted ONLY on genuine user interaction (date pick,
  // periodicity, drilldown), and those are enabled only in `local` mode.
  useEffect(() => {
    const init = initialTimeFromConfig(timeConfig);
    setRange(init.range);
    setPreset(init.presetId);
    setPresetLabel(init.presetLabel);
    // Fixed/global periodicity is config-driven; the local picker re-defaults to
    // the coarsest available window via the range effect below, so don't clobber
    // its selection here.
    if (pickerType !== 'local') setBasePeriodicity(periodicityFromConfig(timeConfig));
    setDrillPath([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    timeConfig?.defaultDurationId,
    timeConfig?.type,
    timeConfig?.pickerType,
    timeConfig?.startTime,
    timeConfig?.endTime,
    timeConfig?.defaultPeriodicity,
    JSON.stringify(timeConfig?.fixedDuration ?? null),
    JSON.stringify(timeConfig?.cycleTime ?? null),
    // Editing a duration (its length/periodicity) changes allDurations but may
    // keep the same defaultDurationId — re-resolve the picker range so the chip
    // reflects the edited window, not a stale one.
    JSON.stringify(timeConfig?.allDurations ?? []),
  ]);

  useEffect(() => {
    // Only the local picker derives periodicity from the (user-chosen) range.
    // In fixed/global mode periodicity is config-driven (the set-duration's
    // periodicity / the linked GTP), so never reset it here — that would clobber
    // the configured value and make the duration chip show the wrong cadence.
    if (pickerType !== 'local') return;
    if (!availablePeriodicities.length) return;
    if (!availablePeriodicities.includes(basePeriodicity)) {
      // The selected periodicity is no longer valid for the current duration
      // (e.g. Hourly after switching to a Year duration). Snap to the coarsest
      // (highest-order) available option, and re-emit so the resolved data
      // matches what the selector now shows. Keying this effect on the options
      // array (not on `range`) is what makes the *selected value* update even
      // when a duration change doesn't move the resolved window.
      const next = coarsestAvailable(availablePeriodicities);
      if (next && next !== basePeriodicity) {
        setBasePeriodicity(next);
        emitTimeChange(range.start.getTime(), range.end.getTime(), next.toLowerCase());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availablePeriodicities]);

  // A runtime change to the default view mode (Lens update(): Shift or Compare
  // added / switched in the config), the shift LIST, or the TIMEZONE must
  // re-resolve — the host otherwise only reflects the change on a dashboard
  // reload. (Timezone is the same class of bug: editing it in the Time tab
  // updates the envelope, but the host doesn't rebuild the data payload until a
  // reload, so the live fetch keeps the old zone. Re-emitting a TIME_CHANGE with
  // the current window forces the host to re-resolve against the new envelope —
  // exactly what a reload does.) The sync effect above has already set
  // compareOnRef/shiftOnRef, so this emit carries the right intent (shifts /
  // comparisonMode). Skips the first run (the initial resolve already matches the
  // config) and only fires when a tracked value flips. MUST live above the early
  // returns below (Rules of Hooks). `emitTimeChange` is a hoisted function
  // declaration, so calling it here is fine even though it's defined further down.
  const shiftsSig = JSON.stringify(timeConfig?.shifts ?? []);
  const tzSig = timeConfig?.timezone ?? '';
  const modeDefaultsSigRef = useRef<string | null>(null);
  useEffect(() => {
    const sig = `${compareDefault}|${shiftDefault}|${shiftsSig}|${tzSig}`;
    if (modeDefaultsSigRef.current === null) { modeDefaultsSigRef.current = sig; return; }
    if (sig === modeDefaultsSigRef.current) return;
    modeDefaultsSigRef.current = sig;
    const rr = rangeRef.current;
    emitTimeChange(rr.start.getTime(), rr.end.getTime(), basePeriodicity.toLowerCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareDefault, shiftDefault, shiftsSig, tzSig]);

  // ── Empty / loading / error states ─────────────────────────────────────────
  // Priority order matters: a hard error wins over everything; an unconfigured
  // widget never looks like a data problem; "no data source" is distinct from
  // "data source set but nothing came back".

  // 1. Something went wrong — any non-data error surfaced by the host/engine.
  if (error) {
    return (
      <div className="cc-widget cc-widget--empty">
        <EmptyState
          illustration={<TechnicalHiccupIllustration size={120} />}
          title="Something went wrong"
          description="We couldn't load this. Refresh the page or try again in a few moments"
        />
      </div>
    );
  }

  // 2. Widget not configured — freshly dropped, no charts defined yet.
  const hasAnyChart = (config.charts ?? []).length > 0;
  if (!hasAnyChart) {
    return (
      <div className="cc-widget cc-widget--empty cc-widget--unconfigured">
        <EmptyState
          illustration={<AddWidgetIllustration size={120} />}
          title="Widget not configured"
          description="Click on the setting button or double click on the widget to configure it"
        />
      </div>
    );
  }

  // 3. Data source not configured — charts exist, but no series bound to data.
  //    Still render the configured chart name + the description Info icon (next
  //    to the settings icon) so the saved Chart Settings are reflected here.
  const hasAnySeries = (config.charts ?? []).some((c) => c.series.length > 0);
  if (!hasAnySeries) {
    // Render the chart name(s) through the same ChartSwitcher as the populated
    // widget, with the empty-state illustration as each tab's content.
    const emptyItems = (config.charts ?? []).map((chart, ci) => ({
      id: chart._id || `chart-${ci}`,
      label: chart.title || `Chart ${ci + 1}`,
      type: 'column' as const,
      children: (
        <div className="cc-widget cc-widget--empty">
          <EmptyState
            illustration={<NoDataOneIllustration size={120} />}
            title="Data source not configured"
            description="Add a data source to start monitoring and visualizing data"
          />
        </div>
      ),
    }));
    const emptyActiveId = emptyItems.find((it) => it.id === activeChartId)?.id ?? emptyItems[0]?.id;
    const emptyActions = (
      <div className="cc-widget__actions">
        {config.description && !widgetElements.hideInfoIcon && (
          <Tooltip bodyText={config.description} placement="BottomEnd">
            <IconButton icon={<Info size={16} />} aria-label="Chart info" size="16" />
          </Tooltip>
        )}
        {!widgetElements.hideSettingsIcon && (
          <Tooltip bodyText="Chart settings" placement="BottomEnd">
            <IconButton icon={<Settings size={16} />} aria-label="Chart settings" size="16" />
          </Tooltip>
        )}
      </div>
    );
    return (
      <div className="cc-widget-shell cc-widget-shell--borderless">
        {/* Same consistent ChartSwitcher treatment as the populated widget; the
            dropdown chevron is hidden for a single chart. */}
        <ChartSwitcher
          className={[
            hideChartTitle ? 'cc-widget--hide-title' : '',
            emptyItems.length <= 1 ? 'cc-widget--single-view' : '',
          ].filter(Boolean).join(' ') || undefined}
          actions={emptyActions}
          items={emptyItems}
          activeId={emptyActiveId}
          onActiveChange={setActiveChartId}
        />
      </div>
    );
  }

  // 4. First load — bound series exist and the first resolve hasn't arrived yet
  //    (or the host reports loading with no data on screen). Shows the spinner
  //    instead of the empty state or a half-filled chart, capped by
  //    LOADING_TIMEOUT_MS so an empty result eventually falls through to "Data
  //    not available" rather than spinning forever. Subsequent refetches (data
  //    already present) use the overlay in the main render, not this.
  if (isFirstLoad) {
    return (
      <div className="cc-widget cc-widget--loading">
        <Spinner size="XLarge" label="Loading chart data…" labelPosition="Bottom" />
      </div>
    );
  }

  // 5. Data not available — data source configured, but nothing came back.
  if (data.length === 0) {
    return (
      <div className="cc-widget cc-widget--empty">
        <EmptyState
          illustration={<NoDataOneIllustration size={120} />}
          title="Data not available"
          description="We couldn't find any data matching your request"
        />
      </div>
    );
  }

  // ── Shared time helpers ───────────────────────────────────────────────────

  // Only the LOCAL picker is user-controllable. Fixed (locked set-duration) and
  // global (window owned by the linked Global Time Picker) both take their time
  // externally, so every local interaction that would emit a TIME_CHANGE
  // override — the date picker, periodicity selector, and point-click drilldown
  // — is disabled in those modes.
  const pickerType    = timeConfig?.pickerType ?? (timeConfig?.type as TimeConfig['pickerType']) ?? 'local';
  const isLocalPicker = pickerType === 'local';
  const drilldownEnabled = timeDrillDown && isLocalPicker;

  // basePeriodicity can be stale/invalid for the current duration — e.g. a
  // fixed/global picker keeps the configured defaultPeriodicity (Hourly) even
  // when the linked duration only offers Monthly/Weekly/Daily, and the local
  // snap effect doesn't run for those pickers. Clamp to a valid option (the
  // coarsest when the current one isn't offered) so the selector, the effective
  // periodicity, and drilldown never key off a periodicity the duration lacks.
  const validBasePeriodicity: Periodicity =
    availablePeriodicities.includes(basePeriodicity)
      ? basePeriodicity
      : (coarsestAvailable(availablePeriodicities) ?? basePeriodicity);
  const baseIdx            = LEVEL_ORDER.indexOf(validBasePeriodicity);
  const effectiveIdx       = Math.min(baseIdx + drillPath.length, LEVEL_ORDER.length - 1);
  const effectivePeriodicity: Periodicity = LEVEL_ORDER[effectiveIdx];

  function emitTimeChange(startTime: number, endTime: number, periodicity: string) {
    // Never emit on initial mount. The SDK DatePicker echoes onRangeChange /
    // onPresetSelect while mounting, which would fire a redundant TIME_CHANGE for
    // the config-derived default window the host has ALREADY resolved from the
    // envelope. `didMountRef` flips true only after the first paint (see the
    // effect below), so these mount echoes are dropped and TIME_CHANGE fires only
    // on genuine user interaction (date pick, periodicity, drilldown, shift…).
    if (!didMountRef.current) return;
    // Ride the latest applied comparison window (if Compare is on) so the engine
    // resolves that exact period rather than the default preceding window.
    const cr = compareOnRef.current ? compRangeRef.current : null;
    // Ride the configured shifts + operator when the Shift toggle is on (mutually
    // exclusive with Compare) so the engine resolves per-shift buckets. Read from
    // the ref so the toggle handler can emit before its state flush.
    const shiftActive = shiftOnRef.current && shiftsConfigured;
    const event: WidgetEvent = {
      type: 'TIME_CHANGE',
      payload: {
        startTime: String(startTime),
        endTime:   String(endTime),
        periodicity,
        // Explicit compare state — the engine uses this (not the persisted
        // comparisonMode config flag) so turning Compare off drops the overlay.
        comparisonMode: compareOnRef.current,
        ...(cr
          ? {
              comparisonStartTime: String(cr.start.getTime()),
              comparisonEndTime:   String(cr.end.getTime()),
            }
          : {}),
        ...(shiftActive
          ? {
              // Each shift MUST carry `enabled: true` for the backend to split a
              // bucket into per-shift values (the configurator now persists this,
              // but stamp it here too so an OLDER saved config still gets the
              // split without a re-save). Aggregator mapped to a real operator.
              shifts: (timeConfig?.shifts ?? []).map((s) => ({ ...s, enabled: true })),
              shiftAggregator: shiftAggregatorOperator(timeConfig?.shiftAggregator),
            }
          : {}),
      },
    };
    // Drop the duplicate half of a preset click: selecting a preset fires
    // onPresetSelect AND onRangeChange for the same window, so both handlers emit
    // a TIME_CHANGE within the same tick. For rolling presets (Previous 3 Month
    // etc.) the two windows are re-anchored to Date.now() and differ by a few ms,
    // so an exact-payload comparison misses the duplicate — instead compare
    // everything BUT start/end exactly, and start/end within a small tolerance.
    // Time-bounded so a deliberate re-selection of the same preset seconds later
    // still emits; any genuinely different payload always passes.
    const { startTime: _s, endTime: _e, ...rest } = event.payload as Record<string, unknown>;
    const restSig = JSON.stringify(rest);
    const now = Date.now();
    const last = lastEmitRef.current;
    const EMIT_DEDUPE_WINDOW_MS = 400;   // max gap between the two halves of one click
    const EMIT_DEDUPE_DRIFT_MS  = 1500;  // max start/end drift still considered "same window"
    if (
      last &&
      now - last.time < EMIT_DEDUPE_WINDOW_MS &&
      restSig === last.restSig &&
      Math.abs(startTime - last.start) <= EMIT_DEDUPE_DRIFT_MS &&
      Math.abs(endTime - last.end) <= EMIT_DEDUPE_DRIFT_MS
    ) return;
    lastEmitRef.current = { restSig, start: startTime, end: endTime, time: now };
    onEvent(event);
    // Commit the compare + shift state we just sent — this is the APPLY point,
    // so the render (which gates on appliedCompareOn / appliedShiftOn) now
    // reflects the toggle / default.
    setAppliedCompareOn(compareOnRef.current);
    setAppliedShiftOn(shiftOnRef.current);
    // Immediate local loading feedback: capture the current data reference and
    // flip the refetch overlay on until a fresh `data` reference lands (see the
    // clear effect above) or the safety timeout fires. emitTimeChange is only
    // ever called from user actions (never on mount), so this can't shadow the
    // first-load spinner.
    dataAtRefetchRef.current = data;
    setRefetching(true);
  }

  // Emit for a preset/range APPLY. Marks the apply (so the SDK's stale
  // onRangeChange echo can be dropped) and, when comparison mode is configured,
  // defers the emit to the onComparisonRangeChange callback that the SDK always
  // fires last in the same tick — that one carries the fresh comparison window,
  // so letting it emit yields ONE complete TIME_CHANGE instead of two partial
  // ones. A microtask fallback still emits if no comparison callback arrives
  // (a configured duration picked from the trigger's quick dropdown fires
  // onPresetSelect alone), so an apply can never be silently lost.
  function emitApply(startTime: number, endTime: number, p: Periodicity) {
    applyEmitAtRef.current = Date.now();
    if (!comparisonModeOn) {
      emitTimeChange(startTime, endTime, p.toLowerCase());
      return;
    }
    pendingApplyPeriodicityRef.current = p;
    queueMicrotask(() => {
      const pending = pendingApplyPeriodicityRef.current;
      if (pending === null) return; // the comparison callback emitted for us
      pendingApplyPeriodicityRef.current = null;
      emitTimeChange(startTime, endTime, pending.toLowerCase());
    });
  }

  // Compare switch toggled in the picker. Off → drop the comparison window on the
  // next emit; on → the next applied comparison range carries through.
  function handleComparisonToggle(enabled: boolean) {
    setCompareOn(enabled);
    compareOnRef.current = enabled;
    // Comparison and Shift are mutually exclusive — enabling one disables the
    // other (but both may be off; neither is required).
    if (enabled) { setShiftOn(false); shiftOnRef.current = false; }
    if (!enabled) {
      compRangeRef.current = null;
      setCompRange(null);
    }
    // Apply on toggle — SYMMETRIC with the Shift toggle (which emits immediately).
    // Without this, with Shift already applied, toggling Compare on only flipped
    // the picker switch: `appliedShiftOn` stayed true so the shift view stuck and
    // Comparison never came up until a separate Apply. emitTimeChange commits
    // appliedCompareOn / appliedShiftOn, so the view switches right away. The
    // engine defaults the comparison window to the immediately-preceding period
    // when none is picked; choosing a custom window in the Compare panel re-emits
    // it via handleComparisonRangeChange.
    const r = rangeRef.current;
    emitTimeChange(r.start.getTime(), r.end.getTime(), basePeriodicity.toLowerCase());
  }

  // The picker hands us the resolved comparison window (Previous period / Same
  // period last year / Custom) — on a Compare-panel apply, but ALSO as the last
  // callback of every preset/range apply while showComparison is passed (with
  // `null` when the Compare toggle is off). Three cases:
  //   • an apply deferred its emit here (pending periodicity stashed) → send the
  //     single complete TIME_CHANGE with the fresh window + comparison;
  //   • the comparison window genuinely changed (Compare panel applied) → emit;
  //   • pure echo (nothing changed) → store and stay silent.
  function handleComparisonRangeChange(value: ComparisonDateRange | null) {
    const prev = compRangeRef.current;
    const unchanged =
      (!value && !prev) ||
      (!!value && !!prev &&
        value.start.getTime() === prev.start.getTime() &&
        value.end.getTime() === prev.end.getTime());
    compRangeRef.current = value;
    setCompRange(value);
    const pending = pendingApplyPeriodicityRef.current;
    pendingApplyPeriodicityRef.current = null;
    if (pending === null && unchanged) return;
    const r = rangeRef.current;
    emitTimeChange(r.start.getTime(), r.end.getTime(), (pending ?? basePeriodicity).toLowerCase());
  }

  // Shift toggle — mutually exclusive with Compare (enabling shift disables
  // comparison; both may be off). Unlike Compare, the SDK date picker exposes NO
  // separate shift-apply callback — onShiftToggle IS the commit — so toggling
  // emits directly (which also commits appliedShiftOn via emitTimeChange). The
  // appliedShiftOn gate still keeps "merely configuring a shift" from showing the
  // shift view: only an actual toggle (or default-shift) emits and commits it.
  function handleShiftToggle(enabled: boolean) {
    setShiftOn(enabled);
    shiftOnRef.current = enabled;
    if (enabled) {
      // Stand comparison down (mutually exclusive); null the ref so this emit
      // doesn't also ride a stale comparison window.
      setCompareOn(false);
      compareOnRef.current = false;
      setCompRange(null);
      compRangeRef.current = null;
    }
    const r = rangeRef.current;
    emitTimeChange(r.start.getTime(), r.end.getTime(), basePeriodicity.toLowerCase());
  }

  function handleRangeChange(r: DateRange | null) {
    if (!r) return;
    // Preset-apply echo. Applying a preset fires onPresetSelect first (we
    // resolved + applied a FRESH window there) and then onRangeChange with the
    // window the SDK staged when the preset row was clicked — for rolling
    // presets (Previous 3 Month etc.) that staged window is older by however
    // long the user paused before Apply, so it is NOT byte-identical to ours
    // and would emit a second, stale TIME_CHANGE. Anything landing this close
    // after an apply-emit is that echo: drop it outright.
    if (Date.now() - applyEmitAtRef.current < 500) return;
    // IMPORTANT: do NOT touch `preset`/`presetLabel` here. The SDK owns the
    // selected preset and reports it via onPresetSelect — it passes the preset
    // id when a preset is applied and "custom" when a custom range/day is picked.
    // A built-in preset fires onPresetSelect(id) AND onRangeChange(window); if we
    // reset the preset on that range echo the chip wrongly falls back to "Custom".
    // So here we only apply the window + emit.
    //
    // A preset selection fires BOTH onPresetSelect and onRangeChange for the SAME
    // window. onPresetSelect already applied it and emitted the correctly-snapped
    // periodicity (e.g. Monthly for a year), so skip the redundant echo here —
    // otherwise this would re-emit the STALE basePeriodicity (e.g. Hourly),
    // clobbering the snapped value and fetching at a cadence the window doesn't
    // support.
    const prev = rangeRef.current;
    const sameWindow = !!prev
      && prev.start.getTime() === r.start.getTime()
      && prev.end.getTime() === r.end.getTime();
    rangeRef.current = r;
    setRange(r);
    if (sameWindow) return;
    setDrillPath([]);
    // A genuine custom range: snap the periodicity to what the new window actually
    // supports before emitting, so we never send a stale cadence (Hourly for a
    // year window). Highest (coarsest) available option wins when the current one
    // is no longer valid.
    const p = periodicityForDuration(undefined, r, basePeriodicity);
    if (p !== basePeriodicity) setBasePeriodicity(p);
    emitApply(r.start.getTime(), r.end.getTime(), p);
  }

  // Preset list shown in the date picker = the durations configured in the time
  // tab PLUS the SDK's 11 built-in presets. We merge them ourselves because the
  // SDK uses `presets ?? DEFAULT_PRESETS` (a fallback) — passing our own list
  // would otherwise replace the built-ins entirely.
  // Hiding a custom duration doesn't remove it from allDurations — the SDK
  // leaves it in the array with `hidden: true`, so filter those out before
  // building the picker list (else hidden durations reappear).
  const durationPresets = (timeConfig?.allDurations ?? [])
    .filter((d) => !d.hidden)
    .map((d) => ({
      label: d.label || d.id,
      value: d.id,
    }));
  const builtinPresetOptions = BUILTIN_PRESETS
    .filter((b) => !durationPresets.some((d) => d.value === b.id))
    .map((b) => ({ label: b.label || b.id, value: b.id }));
  // Configured durations first, then the built-ins not already covered.
  const presetOptions = [...durationPresets, ...builtinPresetOptions];

  // Selecting a configured duration: the date picker can't resolve a custom
  // duration id itself (its getPresetDateRange only knows built-ins), so we
  // compute the window here and drive the range/emit ourselves.
  function handlePresetSelect(durationId: string) {
    const dur = (timeConfig?.allDurations ?? []).find((d) => d.id === durationId);
    if (!dur) {
      // Built-in SDK preset (today/yesterday/…): it isn't in allDurations, so
      // resolve its window through the SDK and emit right away. Previously this
      // branch only set the label and returned — so clicking a built-in preset
      // never patched the range end time nor emitted a TIME_CHANGE (the chart
      // only updated after the user also pressed Apply).
      setPreset(durationId);
      setPresetLabel(DATEPICKER_PRESET_LABELS[durationId] ?? durationId.replace(/_/g, ' '));
      const r = getPresetDateRange(durationId);
      if (r?.start && r?.end) {
        const startMs = r.start.getTime();
        // getPresetDateRange returns single-day presets (today/yesterday) as a
        // zero-width [dayStart, dayStart] window — sending startTime === endTime
        // fetches no data. Advance endTime to the real period end as epoch ms:
        // the current day runs up to NOW (full-precision), a past day to its
        // end-of-day. startTime/endTime stay epoch-millisecond values.
        let endMs = r.end.getTime();
        if (endMs <= startMs) endMs = Math.min(startMs + 86_400_000, Date.now());
        const start = new Date(startMs);
        const end = new Date(endMs);
        rangeRef.current = { start, end };
        setRange({ start, end });
        setDrillPath([]);
        // Built-in preset: no configured duration, so options derive from the
        // resolved window. Snap the periodicity to a valid option before emitting
        // so we never fetch at a cadence the new window doesn't support.
        const bp = periodicityForDuration(undefined, { start, end }, basePeriodicity);
        if (bp !== basePeriodicity) setBasePeriodicity(bp);
        emitApply(startMs, endMs, bp);
      }
      return;
    }
    // Respect the configured cycle time when snapping the duration's window.
    const { startTime, endTime } = resolveDurationWindow(dur, Date.now(), timeConfig?.cycleTime);
    // rangeRef holds the applied window; handleRangeChange ignores the picker's
    // echo for the same window, so the selected preset/label survives Apply.
    const durRange = { start: new Date(startTime), end: new Date(endTime) };
    rangeRef.current = durRange;
    setRange(durRange);
    setPreset(dur.id);
    setPresetLabel(dur.label || dur.id);
    setDrillPath([]);
    // Snap the periodicity to one the new duration actually offers (e.g. switching
    // to a Year duration drops Hourly → Monthly) and emit with the corrected value
    // so the selector and the fetched data agree from the first render.
    const p = periodicityForDuration(dur, durRange, basePeriodicity);
    if (p !== basePeriodicity) setBasePeriodicity(p);
    emitApply(startTime, endTime, p);
  }

  function handlePeriodicityChange(p: Periodicity) {
    setBasePeriodicity(p);
    setDrillPath([]);
    emitTimeChange(range.start.getTime(), range.end.getTime(), p.toLowerCase());
  }

  function handleDrillReset() {
    setDrillPath([]);
    emitTimeChange(range.start.getTime(), range.end.getTime(), basePeriodicity.toLowerCase());
  }

  function handleDrillUp(index: number) {
    const newPath = drillPath.slice(0, index + 1);
    setDrillPath(newPath);
    const crumb = drillPath[index];
    emitTimeChange(crumb.startTime, crumb.endTime, basePeriodicity.toLowerCase());
  }

  function handleExport(format: ChartExportFormat) {
    exportChart({
      instance: chartRef.current,
      engine: 'highcharts',
      format,
      fileName: (resolvedTitle || 'chart').replace(/\s+/g, '_').toLowerCase(),
    });
    setExportOpen(false);
  }

  // ── Build one ChartSwitcher item per chart ────────────────────────────────

  // Build one switcher item per CONFIGURED chart (not just those with data), so
  // the title switcher appears whenever more than one chart exists. A chart with
  // no data source yet renders the empty state as its view.
  // Comparison render is driven purely by the DATA: whenever the engine returned
  // comparison-window buckets (`comparisonSlots`) for any entry, charts render
  // through the SDK's comparison pipeline (current + dashed comparison series +
  // ▲/▼ deviation tooltip). Gate on the APPLIED compare state as well as the
  // data: toggling Compare in the picker only flips the switch (compareOn); the
  // view changes when the toggle is APPLIED (Save) — which commits appliedCompareOn
  // and re-resolves. So a not-yet-applied toggle leaves the current view, and once
  // applied off, `appliedCompareOn === false` drops the overlay immediately even
  // if the host still returns comparisonSlots.
  // Comparison is DATA-DRIVEN, exactly like shift (dataHasShiftTags): render the
  // overlay whenever the resolved data carries a comparison window
  // (`comparisonSlots`). The engine only returns comparison slots when compare is
  // actually on — for the LOCAL picker that means the applied Compare toggle, for
  // GTP/FIXED it means the linked picker requested it — so the data's presence is
  // the single reliable signal for every mode.
  //
  // PREVIOUSLY this ANDed `(appliedCompareOn || !isLocalPicker)`. That broke GTP:
  // the runtime timeConfig for a GTP-linked widget doesn't reliably carry
  // `pickerType: 'global'`, so `isLocalPicker` came back true, `!isLocalPicker`
  // false, and (with no local toggle) `appliedCompareOn` false too — comparison
  // silently fell back to the normal chart. Shift kept working because it never
  // checked the picker type. Toggling Compare off on the LOCAL picker still drops
  // the overlay: the compare-off re-resolve returns slots-free data.
  const comparisonOn =
    data.some((d) => Array.isArray(d.comparisonSlots) && d.comparisonSlots.length > 0);
  // Shift render.
  //  • LOCAL picker → toggle-driven: the widget's own Shift toggle commits
  //    `appliedShiftOn` (buildChartShift derives each bucket's shift from its
  //    time-of-day, so it doesn't need the data pre-tagged).
  //  • GTP / FIXED picker → there is NO local toggle; the LINKED picker owns the
  //    mode, which reaches us only through the resolved data — exactly how
  //    comparison arrives via `comparisonSlots`. Detect shift there from the
  //    backend's per-bucket `slot.shift` tags (present when the engine resolved
  //    shift for that picker). Without this, GTP shift never rendered while GTP
  //    comparison did (comparison has the `comparisonMode` flag; shift had no
  //    equivalent trigger).
  // Comparison wins (mutually exclusive).
  const dataHasShiftTags = data.some((d) => Array.isArray(d.slots) &&
    d.slots.some((s) => typeof s.shift === 'string' && s.shift.length > 0));
  // `appliedShiftOn` = the toggle intent (immediate on toggle, before data lands);
  // `dataHasShiftTags` = the resolved data actually carries shift buckets. The OR
  // of the two does three jobs:
  //   • immediate switch INTO shift on toggle (intent, before data arrives),
  //   • GTP / fixed detection (no local toggle — follow the data's tags),
  //   • and it keeps the shift view up DURING a switch OUT of shift (shift→compare)
  //     until the new mode's data replaces the still-shift-tagged data — without
  //     it the applied flag flips first, neither gate matches the stale data, and
  //     the chart flashes to Normal (and double-remounts) mid-switch.
  // Safe against "merely configuring a shift": the engine only tags buckets when
  // shift was actually requested, so untriggered shift never produces tags.
  // Use cfgShifts.length (not shiftsConfigured) so the GTP fallback (shift defs
  // DERIVED from tags when the persisted config has none) still enables the view.
  const shiftDataOn =
    !comparisonOn &&
    cfgShifts.length > 0 &&
    (appliedShiftOn || dataHasShiftTags);
  // Sub-daily shifts (minute/hourly) are contiguous time-of-day blocks, so we
  // bridge segment boundaries; at Daily+ each shift stays its own line.
  const shiftSubDaily = ['minute', 'hourly'].includes(effectivePeriodicity.toLowerCase());
  const deviationPattern: DeviationPattern =
    timeConfig?.deviationPattern === 'red-up-positive' ? 'red-up-positive' : 'green-up-positive';
  // Per-source overrides only apply when "Advanced Settings → per-source
  // indicator" is enabled; otherwise every series uses the chart-wide pattern.
  const perSourceOverrides: Record<string, DeviationPattern> | undefined =
    timeConfig?.allowPerSourceIndicator
      ? (timeConfig.sourceDeviationOverrides as Record<string, DeviationPattern> | undefined)
      : undefined;

  const items = (config.charts ?? [])
    .map((chart, ci) => {
      const tabLabel = chart.title || `Chart ${ci + 1}`;
      const hasLines   = chart.series.some((s) => s.chartType === 'Line');
      const hasColumns = chart.series.some((s) => s.chartType !== 'Line');
      const chartTabType: 'column' | 'line' = hasLines && !hasColumns ? 'line' : 'column';

      if (chart.series.length === 0) {
        return {
          id: chart._id || `chart-${ci}`,
          label: tabLabel,
          type: chartTabType,
          children: (
            <div className="cc-widget cc-widget--empty">
              <EmptyState
                illustration={<NoDataOneIllustration size={120} />}
                title="Data source not configured"
                description="Add a data source to start monitoring and visualizing data"
              />
            </div>
          ),
        };
      }

      // Shift Mode render path — one segmented series per shift, drawn through
      // the SDK's ComboLineChart `shift` contract (columns stay columns, lines
      // stay lines via each series' seriesType). Mutually exclusive with
      // comparison. Guarded so a bad data shape falls through to the normal chart.
      if (shiftDataOn) {
        try {
          const built = buildChartShift(
            chart, ci, data, cfgShifts, enabledShiftIds, shiftSubDaily, toggleShift, timeConfig?.timezone,
          );
          if (built) {
            // Plot lines/bands render in EVERY view mode, not just normal.
            const { plotLines: shiftPlotLines, plotBands: shiftPlotBands } =
              buildPlotLinesBands(chart, ci, data, config, effectivePeriodicity);
            // Right axis: the 2-entry yAxis array (the axes). Each series already
            // carries its `yAxis` from buildChartShift (0.7.35+), so the binding
            // rides the series and survives in-place updates — no onChartReady
            // reassignment or remount needed. Null when the chart has no Right
            // axis → plain plotLines/plotBands props.
            const comboAxes = buildComboAxes(
              chart, config.style.yAxisUnit || '', shiftPlotLines, shiftPlotBands,
            );
            // Right-axis yAxis (if any) + the fullscreen tooltip override merged
            // into one highchartsOptions. In fullscreen force `tooltip.outside:
            // false` so the value tooltip renders inside the fullscreen element
            // (SDK theme defaults to outside:true → document.body, hidden).
            const shiftHco: Record<string, unknown> = { ...(comboAxes ? comboAxes.highchartsOptions : {}) };
            if (isFullscreen) shiftHco.tooltip = { outside: false };
            return {
              id: chart._id || `chart-${ci}`,
              label: tabLabel,
              type: chartTabType,
              children: (
                <ComboLineChart
                  key={`${chart._id}:shift:${scrollable}:${isFullscreen}`}
                  bare
                  categories={built.categories}
                  tooltipCategories={built.tooltipCategories}
                  shift={built.shift}
                  showDataLabels={showDataLabels}
                  yAxisUnit={config.style.yAxisUnit || undefined}
                  scrollable={scrollable}
                  {...(Object.keys(shiftHco).length > 0 ? { highchartsOptions: shiftHco } : {})}
                  {...(!comboAxes
                    ? {
                        ...(shiftPlotLines.length > 0 ? { plotLines: shiftPlotLines } : {}),
                        ...(shiftPlotBands.length > 0 ? { plotBands: shiftPlotBands } : {}),
                      }
                    : {})}
                  {...(scrollable ? { scrollableMinWidth: built.categories.length * SCROLL_MIN_PX_PER_CATEGORY } : {})}
                  onChartReady={(instance: unknown) => { chartRef.current = instance; }}
                />
              ),
            };
          }
        } catch {
          // Shift render failed — fall through to the normal chart below.
        }
      }

      // Comparison Mode render path — current vs prior-period overlay with the
      // ▲/▼ deviation indicator. Built through the SDK's ComboLineChart (the
      // only chart that carries the comparison render contract).
      if (comparisonOn) {
        // Guard the comparison pipeline so a bad data shape can never blank the
        // whole widget — on any error fall through to the normal chart below.
        try {
          const cmp = buildChartComparison(chart, ci, data, perSourceOverrides);
          if (cmp && cmp.sources.length > 0) {
            const { series } = buildComparisonSeries({ sources: cmp.sources, deviationPattern });
            // Plot lines/bands render in EVERY view mode, not just normal.
            const { plotLines: cmpPlotLines, plotBands: cmpPlotBands } =
              buildPlotLinesBands(chart, ci, data, config, effectivePeriodicity);
            // Right axis: the 2-entry yAxis array (the axes). Each source carries
            // its `yAxis` from buildChartComparison (0.7.35+), which
            // buildComparisonSeries propagates onto both its current + comparison
            // series — so the binding rides the series. Null → plain props.
            const comboAxes = buildComboAxes(
              chart, config.style.yAxisUnit || '', cmpPlotLines, cmpPlotBands,
            );
            // Right-axis yAxis (if any) + the fullscreen tooltip override merged
            // into one highchartsOptions (see the shift path for why).
            const cmpHco: Record<string, unknown> = { ...(comboAxes ? comboAxes.highchartsOptions : {}) };
            if (isFullscreen) cmpHco.tooltip = { outside: false };
            return {
              id: chart._id || `chart-${ci}`,
              label: tabLabel,
              type: chartTabType,
              children: (
                <ComboLineChart
                  key={`${chart._id}:cmp:${scrollable}:${isFullscreen}`}
                  bare
                  categories={cmp.categories}
                  tooltipCategories={cmp.tooltipCategories}
                  comparison={{ series, showDeviation: true, comparisonCategories: cmp.comparisonCategories }}
                  showLegend={showLegend}
                  showDataLabels={showDataLabels}
                  {...(Object.keys(cmpHco).length > 0 ? { highchartsOptions: cmpHco } : {})}
                  {...(!comboAxes
                    ? {
                        ...(cmpPlotLines.length > 0 ? { plotLines: cmpPlotLines } : {}),
                        ...(cmpPlotBands.length > 0 ? { plotBands: cmpPlotBands } : {}),
                      }
                    : {})}
                  // The comparison-period line is dotted (dashStyle "Dot") and
                  // shares its source's marker/axis with the current line — the
                  // SDK's own Comparison example enables markers so that dotted
                  // line's points are visible instead of blending into the solid
                  // current line. Required for the line's comparison to show
                  // (columns encode the period via pattern-fill, so they show
                  // without this).
                  showMarkers
                  yAxisUnit={config.style.yAxisUnit || undefined}
                  scrollable={scrollable}
                  {...(scrollable ? { scrollableMinWidth: cmp.categories.length * SCROLL_MIN_PX_PER_CATEGORY } : {})}
                  onChartReady={(instance: unknown) => { chartRef.current = instance; }}
                />
              ),
            };
          }
        } catch (err) {
          // Comparison render failed — fall through to the normal chart below.
          // Surfaced (not silent) so a real pipeline error is diagnosable instead
          // of looking like "compare isn't working".
          // eslint-disable-next-line no-console
          console.error('[CombinedBarLineChart] comparison render failed', err);
        }
      }

      const displayData = buildChartDisplayData(chart, ci, data, config, effectivePeriodicity, showDataLabels);
      const { resolvedSeries, categories, plotLines, plotBands, yAxisUnit, firstPayload, highchartsOptions } = displayData;
      // In fullscreen the Highcharts tooltip must render INSIDE the fullscreen
      // element. The SDK theme sets `tooltip.outside: true` (→ document.body,
      // behind the fullscreen top layer), so force it off while fullscreen.
      if (isFullscreen) {
        highchartsOptions.tooltip = { ...(highchartsOptions.tooltip as Record<string, unknown> | undefined), outside: false };
      }

      function handlePointClick(ctx: { category: string }) {
        if (!drilldownEnabled || !firstPayload) return;
        if (effectiveIdx >= LEVEL_ORDER.length - 1) return;
        const slot = firstPayload.slots.find((s) => s.label === ctx.category);
        if (!slot) return;
        setDrillPath((prev) => [...prev, { label: ctx.category, startTime: slot.from, endTime: slot.to }]);
        emitTimeChange(slot.from, slot.to, nextFinerPeriodicity(effectivePeriodicity).toLowerCase());
      }

      const sharedChartProps = {
        categories,
        series: resolvedSeries,
        showLegend,
        showDataLabels,
        yAxisUnit,
        stacked: config.style.stacked,
        zoomable,
        scrollable,
        // SDK's scrollableMinWidth defaults to 800px — smaller than the widget,
        // so the plot always fits and never scrolls. Scale it to the category
        // count (~56px/bar) so many bars overflow the viewport and scroll.
        ...(scrollable ? { scrollableMinWidth: categories.length * SCROLL_MIN_PX_PER_CATEGORY } : {}),
        ...(plotLines.length > 0 ? { plotLines } : {}),
        ...(plotBands.length > 0 ? { plotBands } : {}),
        onChartReady: (instance: unknown) => { chartRef.current = instance; },
        onPointClick: drilldownEnabled ? handlePointClick : undefined,
        highchartsOptions,
      };

      return {
        id: chart._id || `chart-${ci}`,
        label: tabLabel,
        type: chartTabType,
        // Remount (not in-place update) whenever scroll toggles: Highcharts
        // can't cleanly add/remove scrollablePlotArea via update() — a stale
        // instance keeps scrolling after Scroll is turned off, and toggling it
        // on mid-render disrupts the shift/comparison series setup. A fresh key
        // gives a clean Highcharts instance each time.
        children: <ColumnChartDisplay key={`${chart._id}:${scrollable}:${isFullscreen}`} bare {...sharedChartProps} />,
      };
    });

  // ── Shared slots ──────────────────────────────────────────────────────────

  const resolvedTitle = (getValue('title', config, data) as string) || config.title || 'Combined Chart';

  const breadcrumbSlot = drillPath.length > 0 ? (
    <Breadcrumb size="Small">
      <BreadcrumbItem
        type="Icon"
        icon={<Home size={12} />}
        aria-label="Reset to full range"
        onClick={handleDrillReset}
      />
      {drillPath.map((entry, i) => (
        <BreadcrumbItem
          key={`${i}-${entry.label}`}
          value={entry.label}
          currentItem={i === drillPath.length - 1}
          onClick={() => handleDrillUp(i)}
        />
      ))}
    </Breadcrumb>
  ) : undefined;

  // Subtitle under the chart title. The fixed-duration chip shows the picked
  // window + periodicity ("fixed" time option). In local mode the window is
  // controlled via the inline date picker (no chip). In global mode the window
  // is owned by the linked Global Time Picker — the widget shows no local
  // controls but DOES label the link so it's clear the time is externally owned.
  const durationSlot = pickerType === 'fixed'
    ? `${presetLabel} · ${effectivePeriodicity}${
        drillPath.length > 0 ? ` › ${drillPath[drillPath.length - 1].label}` : ''
      }`
    : pickerType === 'global'
      ? 'Linked to Global Time Picker'
      : undefined;

  // Only local mode exposes the inline date picker + periodicity selector. For
  // fixed/global the filters slot is omitted entirely (undefined, not an empty
  // fragment) so the SDK Chart reclaims that row for the chart canvas. In
  // fullscreen the pickers are hidden too: their popovers portal to <body>,
  // which renders under the native-fullscreen top layer and can't be used.
  const filtersSlot = (isLocalPicker && !isFullscreen) ? (
    <>
      <DatePicker
        mode="range"
        placeholder="Select range"
        rangeValue={range}
        selectedPreset={preset}
        presets={presetOptions}
        onPresetSelect={handlePresetSelect}
        onRangeChange={handleRangeChange}
        {...(comparisonModeOn
          ? {
              showComparison: true,
              comparisonEnabled: compareOn,
              onComparisonToggle: handleComparisonToggle,
              comparisonRangeValue: compRange,
              onComparisonRangeChange: handleComparisonRangeChange,
            }
          : {})}
        {...(shiftsConfigured
          ? {
              showShift: true,
              shiftEnabled: shiftOn,
              onShiftToggle: handleShiftToggle,
            }
          : {})}
      />
      {/* The periodicity dropdown is hidden when "Disable Periodicities" is on
          in the time tab — the widget just uses the default periodicity. */}
      {!timeConfig?.disablePeriodicities && (
        <div className="cc-widget__periodicity-select">
          <SelectInput
            label=""
            placeholder="Periodicity"
            value={validBasePeriodicity}
            isOpen={periodicityOpen}
            // Only one periodicity is mapped to this duration — there's nothing
            // else to pick, so disable the dropdown.
            isDisabled={availablePeriodicities.length <= 1}
            // Use onOpenChange (not onClick) so the SDK can drive open/close —
            // including closing on an outside click. onClick only fires on the
            // trigger, so the dropdown stayed open when clicking elsewhere.
            onOpenChange={setPeriodicityOpen}
          >
            {periodicityOpen && (
              <DropdownMenu>
                <ActionListItemGroup>
                  {/* Always list options coarsest → finest (Monthly, Weekly,
                      Daily, Hourly) regardless of how availablePeriodicities is
                      ordered. LEVEL_ORDER already encodes that descending order. */}
                  {[...availablePeriodicities]
                    .sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b))
                    .map((p) => (
                    <ActionListItem
                      key={p}
                      title={p}
                      selectionType="Single"
                      isSelected={validBasePeriodicity === p}
                      onClick={() => { handlePeriodicityChange(p); setPeriodicityOpen(false); }}
                    />
                  ))}
                </ActionListItemGroup>
              </DropdownMenu>
            )}
          </SelectInput>
        </div>
      )}
    </>
  ) : undefined;

  const actionsSlot = (
    <div className="cc-widget__actions">
      {config.description && !widgetElements.hideInfoIcon && (
        <Tooltip
          bodyText={config.description}
          placement="BottomEnd"
        >
          <IconButton icon={<Info size={16} />} aria-label="Chart info" size="16" />
        </Tooltip>
      )}
      {!widgetElements.hideSettingsIcon && (
        <Tooltip bodyText="Chart settings" placement="BottomEnd">
          <IconButton
            icon={<Settings size={16} />}
            aria-label="Chart settings"
            size="16"
            onClick={(e) => openMenu(e, 'settings')}
          />
        </Tooltip>
      )}
      {!widgetElements.hideExportIcon && (
        <Tooltip bodyText="More" placement="BottomEnd">
          <IconButton
            icon={<Menu size={16} />}
            aria-label="Export chart"
            size="16"
            onClick={(e) => openMenu(e, 'export')}
          />
        </Tooltip>
      )}

      {settingsOpen && createPortal(
        <DropdownMenu className="cc-widget__menu" style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 'max-content', minWidth: 200, zIndex: 500 }}>
          <ActionListItem contentType="SectionHeading" title="Chart Control" />
          <ActionListItem title="Legends"    selectionType="Multiple" isSelected={showLegend}     onClick={() => setShowLegend((v) => !v)} />
          <ActionListItem title="Data Label" selectionType="Multiple" isSelected={showDataLabels} onClick={() => setShowDataLabels((v) => !v)} />
          <ActionListItem title="Scroll"     selectionType="Multiple" isSelected={scrollable}     onClick={() => setScrollable((v) => !v)} />
        </DropdownMenu>,
        // Portal into the fullscreen element when active so the menu shows on the
        // fullscreen top layer (else it renders behind it).
        document.fullscreenElement ?? document.body,
      )}
      {exportOpen && createPortal(
        <DropdownMenu className="cc-widget__menu" style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 150, minWidth: 150, zIndex: 500 }}>
            <ActionListItem title={isFullscreen ? 'Exit Full Screen Mode' : 'View in Full Screen'} selectionType="Single" onClick={handleFullscreen} />
            <ActionListItem contentType="Separator" />
            <ActionListItem contentType="SectionHeading" title="Export" />
            <ActionListItem title="PNG"  selectionType="Single" onClick={() => { handleExport('PNG');  setExportOpen(false); }} />
            <ActionListItem title="JPEG" selectionType="Single" onClick={() => { handleExport('JPEG'); setExportOpen(false); }} />
            <ActionListItem title="SVG"  selectionType="Single" onClick={() => { handleExport('SVG');  setExportOpen(false); }} />
            <ActionListItem title="CSV"  selectionType="Single" onClick={() => { handleExport('CSV');  setExportOpen(false); }} />
            <ActionListItem title="XLSX" selectionType="Single" onClick={() => { handleExport('XLSX'); setExportOpen(false); }} />
        </DropdownMenu>,
        // Portal into the fullscreen element when active so the menu shows on the
        // fullscreen top layer (else it renders behind it).
        document.fullscreenElement ?? document.body,
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  // Keep the controlled active id pointing at a chart that actually exists in
  // the current item list (charts can be added/removed/renamed). Fall back to
  // the first available chart so the switcher always has a valid selection.
  const activeId = items.find((it) => it.id === activeChartId)?.id ?? items[0]?.id;

  // Collapse the empty header bits so the chart fills the freed space:
  //  • title row (title + duration chip) when the title is hidden and there's
  //    no duration chip / breadcrumb to show
  //  • the actions row when every header icon is hidden
  const infoShown = !!config.description && !widgetElements.hideInfoIcon;
  // In fullscreen the header shows just the chart — no date picker, periodicity,
  // or action icons (settings/export/info). Exit is via the Esc key (native
  // fullscreen). `actionsEmpty` also collapses the actions row so no gap is left.
  const actionsEmpty = isFullscreen || (!infoShown && widgetElements.hideSettingsIcon && widgetElements.hideExportIcon);
  const titleRowEmpty = hideChartTitle && !durationSlot && drillPath.length === 0;
  const shellClass = [
    'cc-widget-shell',
    advancedSettings?.enabled && 'cc-widget-shell--title-styled',
    titleRowEmpty && 'cc-widget--no-title-row',
    actionsEmpty && 'cc-widget--no-actions',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={shellRef}
      className={shellClass}
      style={widgetTitleStyle}
    >
      {/* Single chart → base `Chart` with a STRING title, so the SDK's built-in
          title-truncation Tooltip shows the full title on hover when it
          ellipsizes (the ChartViewSwitcher used for multi-chart renders no such
          tooltip). `Chart` and `ChartSwitcher` share the same base layout, so the
          header is identical either way. Multi chart → ChartSwitcher for the
          switch dropdown. */}
      {items.length <= 1 ? (
        <Chart
          breadcrumb={breadcrumbSlot}
          duration={durationSlot}
          filters={filtersSlot}
          actions={isFullscreen ? undefined : actionsSlot}
          className={hideChartTitle ? 'cc-widget--hide-title' : undefined}
          title={items[0]?.label ?? ''}
        >
          {items[0]?.children}
        </Chart>
      ) : (
        <ChartSwitcher
          breadcrumb={breadcrumbSlot}
          duration={durationSlot}
          filters={filtersSlot}
          actions={isFullscreen ? undefined : actionsSlot}
          className={hideChartTitle ? 'cc-widget--hide-title' : undefined}
          items={items}
          activeId={activeId}
          onActiveChange={setActiveChartId}
        />
      )}
      {/* Refetch overlay — a time / periodicity change, compare/shift toggle or
          drilldown re-resolves data while the previous chart stays on screen.
          Overlay a spinner over the canvas so the header + controls remain
          visible and usable, instead of blanking the whole widget. */}
      {isRefetching && (
        <div className="cc-widget__loading-overlay" aria-busy="true">
          <Spinner size="Large" label="Loading chart data…" labelPosition="Bottom" />
        </div>
      )}
    </div>
  );
}
