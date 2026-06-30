import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ColumnChart as ColumnChartDisplay } from '@faclon-labs/design-sdk/ColumnChart';
import { ComboLineChart } from '@faclon-labs/design-sdk/ComboLineChart';
import { buildComparisonSeries } from '@faclon-labs/design-sdk';
import type { ComparisonSourceData } from '@faclon-labs/design-sdk';
import { LineChart } from '@faclon-labs/design-sdk/LineChart';
import { AreaChart } from '@faclon-labs/design-sdk/AreaChart';
import { ChartSwitcher } from '@faclon-labs/design-sdk/ChartSwitcher';
import { exportChart } from '@faclon-labs/design-sdk/Chart';
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
import './CombinerBarLineChart.css';

interface CombinedBarLineChartProps {
  config?: ColumnChartUIConfig;
  data?: DataEntry[];
  /** Comparison-period data (same shape as `data`) — supplied by the engine when
   *  the time tab's Comparison Mode is on. Drives the ▲/▼ deviation overlay. */
  comparisonData?: DataEntry[];
  onEvent: (event: WidgetEvent) => void;
  timeConfig?: TimeConfig;
  /** Host sets this while the engine is resolving data, to suppress the
   *  "Data not available" state until the first resolve completes. */
  loading?: boolean;
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

interface DrillEntry { label: string; startTime: number; endTime: number; }

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

function getSeriesData(key: string, data: DataEntry[]): SeriesPayload | null {
  const entry = data.find((d) => d.key === key);
  if (!entry) return null;
  // Raw API item: series fields (slots/meta/range/path) sit at the top level
  // of the entry — this is what the engine passes through as-is.
  if (Array.isArray(entry.slots)) {
    return {
      __type: 'series',
      path: entry.path ?? '',
      meta: entry.meta as SeriesPayload['meta'],
      range: entry.range ?? { from: 0, to: 0 },
      slots: entry.slots,
    };
  }
  // Backward-compat: wrapped DataEntry where value is a SeriesPayload.
  const v = entry.value;
  if (v !== null && typeof v === 'object' && (v as SeriesPayload).__type === 'series') {
    return v as SeriesPayload;
  }
  return null;
}

function getValue(key: string, config: unknown, data: DataEntry[]): string | number | null {
  const entry = data.find((d) => d.key === key);
  if (entry !== undefined) {
    // A series entry (raw slots at top level, or a wrapped SeriesPayload) is
    // not a scalar — never coerce it through getValue.
    if (Array.isArray(entry.slots)) return null;
    const v = entry.value;
    if (v !== null && typeof v === 'object') return null;
    return (v ?? null) as string | number | null;
  }
  const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.');
  return parts.reduce((acc: unknown, k) => (acc as Record<string, unknown>)?.[k], config) as string | number | null;
}

function nextFinerPeriodicity(p: Periodicity): Periodicity {
  const idx = LEVEL_ORDER.indexOf(p);
  return idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : p;
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

function buildChartDisplayData(
  chart: ChartConfig,
  ci: number,
  data: DataEntry[],
  config: ColumnChartUIConfig,
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

  function resolveNumeric(key: string, fallback: number | string): number | null {
    const raw = getValue(key, config, data) ?? fallback;
    const n = typeof raw === 'number' ? raw : parseFloat(String(raw));
    return isNaN(n) ? null : n;
  }

  // A plot line/band can be pinned to the Right axis (yAxis 1), but only when
  // the chart actually has one — otherwise it folds back onto the Left axis.
  const chartHasRightAxis = (chart.axes ?? []).some((a) => a.yAxis === 1);
  const plotAxisOf = (y?: 0 | 1): 0 | 1 => (chartHasRightAxis && y === 1 ? 1 : 0);

  const plotLines = (chart.plotLines ?? [])
    .map((p, i) => {
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

  // Highcharts-native versions of the plot lines/bands, mirroring the
  // defaults the design-sdk ColumnChart applies to its own `plotLines`/
  // `plotBands` props. Needed because when we hand the SDK an explicit
  // `yAxis` array (multi-axis), Highcharts.merge replaces the SDK's yAxis
  // object — discarding the plot lines/bands it put there. So we inject
  // them directly onto the correct axis entry to survive the merge. Each is
  // split into Left (axis 0) and Right (axis 1) groups so it draws against the
  // scale the user chose.
  const toHcLine = (p: typeof plotLines[number]) => ({
    value: p.value,
    color: p.color ?? '#ef4444',
    width: p.width ?? 2,
    dashStyle: p.dashStyle ?? 'Solid',
    zIndex: 5,
    ...(p.label ? { label: { text: p.label, align: 'right', style: { color: p.color ?? '#ef4444' } } } : {}),
  });
  const toHcBand = (p: typeof plotBands[number]) => ({
    from: p.from,
    to: p.to,
    color: p.color ?? 'rgba(239,68,68,0.1)',
    zIndex: 0,
    ...(p.label ? { label: { text: p.label, align: 'right' } } : {}),
  });
  const hcPlotLinesLeft  = plotLines.filter((p) => p.yAxis !== 1).map(toHcLine);
  const hcPlotLinesRight = plotLines.filter((p) => p.yAxis === 1).map(toHcLine);
  const hcPlotBandsLeft  = plotBands.filter((p) => p.yAxis !== 1).map(toHcBand);
  const hcPlotBandsRight = plotBands.filter((p) => p.yAxis === 1).map(toHcBand);

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
        ? `<div style="margin-top:2px; color:var(--text-gray-secondary, #555); font-size:var(--font-size-50, 12px);">${formatTooltipDate(range.from)} - ${formatTooltipDate(range.to)}</div>`
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
      dataLabels: { rotation: -90, verticalAlign: 'top', y: -4, formatter: dataLabelFormatter },
      ...(hasStacks ? { stacking: 'normal' } : {}),
    },
    line: {
      dataLabels: { formatter: dataLabelFormatter },
    },
  };

  if (needsSeriesOverride) {
    // Auto-hide: an axis with no assigned data source is not drawn (its line /
    // labels / title disappear) while the other axis keeps rendering.
    const leftHasSeries  = resolvedSeries.some((s) => (s.yAxis ?? 0) === 0);
    const rightAxisExists = (chart.axes ?? []).some((a) => a.yAxis === 1) || hasRightAxis;

    const yAxisBase = (hasRightAxis || hasAxes)
      ? [
          {
            title: { text: leftAxisName || yAxisUnit || '' },
            visible: leftHasSeries,
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
        ...(chartColorFallback(advancedSettings.yAxisLineColor) ? { lineColor: chartColorFallback(advancedSettings.yAxisLineColor), tickColor: chartColorFallback(advancedSettings.yAxisLineColor) } : {}),
        ...(chartColorFallback(advancedSettings.gridLineColor) ? { gridLineColor: chartColorFallback(advancedSettings.gridLineColor) } : {}),
      }));
    } else {
      highchartsOptions.yAxis = {
        ...(highchartsOptions.yAxis as Record<string, unknown> | undefined),
        labels: {
          ...(chartColorFallback(advancedSettings.yAxisTextColor) ? { style: { color: chartColorFallback(advancedSettings.yAxisTextColor) } } : {}),
        },
        ...(chartColorFallback(advancedSettings.yAxisLineColor) ? { lineColor: chartColorFallback(advancedSettings.yAxisLineColor), tickColor: chartColorFallback(advancedSettings.yAxisLineColor) } : {}),
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
  comparisonData: DataEntry[],
  // Per-source deviation polarity overrides keyed by `${chartId}:${sourceId}`
  // (Advanced Settings → per-source indicator). Undefined when the feature is
  // off, in which case every series falls back to the chart-wide pattern.
  perSourceOverrides?: Record<string, DeviationPattern>,
): { sources: ComparisonSourceData[]; categories: string[]; comparisonCategories: string[] } | null {
  const firstPayload = chart.series.reduce<SeriesPayload | null>(
    (acc, _, i) => acc ?? getSeriesData(`charts[${ci}].series[${i}].unsPath`, data),
    null,
  );
  if (!firstPayload || firstPayload.slots.length === 0) return null;
  const categories = firstPayload.slots.map((s) => s.label);
  const n = categories.length;

  // Comparison-period bucket labels (same index alignment) — drive the tooltip's
  // "vs <date>" footer. Falls back to the current labels if the window is absent.
  const firstCmpPayload = chart.series.reduce<SeriesPayload | null>(
    (acc, _, i) => acc ?? getSeriesData(`charts[${ci}].series[${i}].unsPath`, comparisonData),
    null,
  );
  const comparisonCategories = firstCmpPayload
    ? firstCmpPayload.slots.map((s) => s.label)
    : categories;

  const sources: ComparisonSourceData[] = chart.series.map((s, i) => {
    const cur = getSeriesData(`charts[${ci}].series[${i}].unsPath`, data);
    const cmp = getSeriesData(`charts[${ci}].series[${i}].unsPath`, comparisonData);
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
    };
  });
  return { sources, categories, comparisonCategories };
}

export function CombinedBarLineChart({ config = EMPTY_UI_CONFIG, data = [], comparisonData, onEvent, timeConfig, loading, error }: CombinedBarLineChartProps) {
  const chartRef = useRef<unknown>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Toggle fullscreen: exit if already in it, otherwise request it on the shell.
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
  const [compareOn, setCompareOn] = useState(comparisonModeOn);
  const [compRange, setCompRange] = useState<ComparisonDateRange | null>(null);
  const compRangeRef = useRef<ComparisonDateRange | null>(null);
  // Shifts configured (in the time tab or inherited from the GTP) → the date
  // picker shows a "Shift" toggle.
  const shiftsConfigured = (timeConfig?.shifts?.length ?? 0) > 0;
  const [shiftOn, setShiftOn] = useState(false);
  // Latest main range, kept in a ref so the Compare callback (which fires
  // separately from the main onRangeChange on Apply) always pairs with the
  // current main window instead of a stale render's `range` state.
  const rangeRef = useRef<DateRange>(range);

  // Periodicity options derive from the active duration (its configured
  // periodicities), like GlobalTimePicker — not from the range length.
  // Built-in presets are intentionally NOT matched here, so a selected built-in
  // leaves `selectedDuration` undefined and `durationPeriodicities` falls back to
  // the SDK's range-length heuristic (getAvailablePeriodicities) — adapting the
  // available periodicities to the preset's actual resolved window.
  const selectedDuration =
    timeConfig?.allDurations?.find((d) => d.id === preset) ??
    (timeConfig?.pickerType === 'fixed' ? timeConfig.fixedDuration : undefined);
  const availablePeriodicities = durationPeriodicities(selectedDuration, range);
  const [basePeriodicity, setBasePeriodicity] = useState<Periodicity>(() => periodicityFromConfig(timeConfig));
  const [drillPath, setDrillPath] = useState<DrillEntry[]>([]);

  // Settings / Export menus: the SDK DropdownMenu is itself the single menu
  // container (not wrapped in a Popover, which would double-nest). We own the
  // trigger, the open state, the anchor position, and dismissal.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const [periodicityOpen, setPeriodicityOpen] = useState(false);

  function openMenu(e: React.MouseEvent, which: 'settings' | 'export') {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Anchor below the icon, right-aligned to it (≈ Popover "Bottom End").
    setMenuPos({ top: rect.bottom + 4, right: Math.max(8, window.innerWidth - rect.right) });
    if (which === 'settings') { setSettingsOpen((v) => !v); setExportOpen(false); }
    else { setExportOpen((v) => !v); setSettingsOpen(false); }
  }

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
  const [scrollable,      setScrollable]      = useState(false);
  const [inexactMultiple, setInexactMultiple] = useState(false);
  const widgetElements = config.style.widgetElements ?? {
    hideWidgetElements: false,
    hideSettingsIcon: false,
    hideExportIcon: false,
    hideChartTitle: false,
    hideInfoIcon: false,
  };
  const advancedSettings = config.style.advancedSettings;
  const titleStyleVars = advancedSettings?.enabled
    ? {
        '--cc-widget-title-font-size': `${advancedSettings.titleFontSize}px`,
        '--cc-widget-title-color': advancedSettings.titleFontColor,
        '--cc-widget-title-weight': String(fontWeightToCss(advancedSettings.titleFontWeight)),
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

  // Debug: log the `data` prop the widget receives from the engine each time it changes.
  useEffect(() => {
    console.log('[ColumnChart] data prop:', data);
  }, [data]);

  useEffect(() => {
    setShowLegend(config.style.showLegend);
    setShowDataLabels(config.style.showDataLabels);
  }, [config.style.showLegend, config.style.showDataLabels]);

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
    setBasePeriodicity(periodicityFromConfig(timeConfig));
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
    if (!availablePeriodicities.includes(basePeriodicity)) {
      const next = availablePeriodicities[0];
      setBasePeriodicity(next);
      // A range/preset change may have emitted with a periodicity that's no
      // longer valid for the new duration. Re-emit at the corrected periodicity
      // so the resolved data matches what the selector now shows.
      if (next) {
        emitTimeChange(range.start.getTime(), range.end.getTime(), next.toLowerCase());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

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
      <div className="cc-widget cc-widget--empty">
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
          <IconButton icon={<Settings size={16} />} aria-label="Chart settings" title="Chart settings" size="16" />
        )}
      </div>
    );
    return (
      <div className="cc-widget-shell cc-widget-shell--borderless">
        {/* Same consistent ChartSwitcher treatment as the populated widget; the
            dropdown chevron is hidden for a single chart. */}
        <ChartSwitcher
          className={[
            widgetElements.hideChartTitle ? 'cc-widget--hide-title' : '',
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

  // 4. Loading — bindings exist, the first resolve hasn't completed yet. Only
  //    shown while the host reports loading, so an empty result falls through
  //    to "Data not available" rather than spinning forever.
  if (loading) {
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

  const baseIdx            = LEVEL_ORDER.indexOf(basePeriodicity);
  const effectiveIdx       = Math.min(baseIdx + drillPath.length, LEVEL_ORDER.length - 1);
  const effectivePeriodicity: Periodicity = LEVEL_ORDER[effectiveIdx];

  function emitTimeChange(startTime: number, endTime: number, periodicity: string) {
    // Ride the latest applied comparison window (if Compare is on) so the engine
    // resolves that exact period rather than the default preceding window.
    const cr = compareOn ? compRangeRef.current : null;
    onEvent({
      type: 'TIME_CHANGE',
      payload: {
        startTime: String(startTime),
        endTime:   String(endTime),
        periodicity,
        ...(cr
          ? {
              comparisonStartTime: String(cr.start.getTime()),
              comparisonEndTime:   String(cr.end.getTime()),
            }
          : {}),
      },
    });
  }

  // Compare switch toggled in the picker. Off → drop the comparison window on the
  // next emit; on → the next applied comparison range carries through.
  function handleComparisonToggle(enabled: boolean) {
    setCompareOn(enabled);
    // Comparison and Shift are mutually exclusive — enabling one disables the
    // other (but both may be off; neither is required).
    if (enabled) setShiftOn(false);
    if (!enabled) {
      compRangeRef.current = null;
      setCompRange(null);
      const r = rangeRef.current;
      emitTimeChange(r.start.getTime(), r.end.getTime(), basePeriodicity.toLowerCase());
    }
  }

  // Apply pressed with Compare on → the picker hands us the resolved comparison
  // window (Previous period / Same period last year / Custom). Store + re-emit so
  // the engine refetches the comparison series for that window.
  function handleComparisonRangeChange(value: ComparisonDateRange | null) {
    compRangeRef.current = value;
    setCompRange(value);
    const r = rangeRef.current;
    emitTimeChange(r.start.getTime(), r.end.getTime(), basePeriodicity.toLowerCase());
  }

  // Shift toggle — mutually exclusive with Compare (enabling shift disables
  // comparison; both may be off).
  function handleShiftToggle(enabled: boolean) {
    setShiftOn(enabled);
    if (enabled) setCompareOn(false);
  }

  function handleRangeChange(r: DateRange | null) {
    if (!r) return;
    // IMPORTANT: do NOT touch `preset`/`presetLabel` here. The SDK owns the
    // selected preset and reports it via onPresetSelect — it passes the preset
    // id when a preset is applied and "custom" when a custom range/day is picked.
    // A built-in preset fires onPresetSelect(id) AND onRangeChange(window); if we
    // reset the preset on that range echo the chip wrongly falls back to "Custom".
    // So here we only apply the window + emit.
    rangeRef.current = r;
    setRange(r);
    setDrillPath([]);
    emitTimeChange(r.start.getTime(), r.end.getTime(), basePeriodicity.toLowerCase());
  }

  // Preset list shown in the date picker = the durations configured in the time
  // tab PLUS the SDK's 11 built-in presets. We merge them ourselves because the
  // SDK uses `presets ?? DEFAULT_PRESETS` (a fallback) — passing our own list
  // would otherwise replace the built-ins entirely.
  const durationPresets = (timeConfig?.allDurations ?? []).map((d) => ({
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
      setPreset(durationId);
      setPresetLabel(DATEPICKER_PRESET_LABELS[durationId] ?? durationId.replace(/_/g, ' '));
      return;
    }
    // Respect the configured cycle time when snapping the duration's window.
    const { startTime, endTime } = resolveDurationWindow(dur, Date.now(), timeConfig?.cycleTime);
    // rangeRef holds the applied window; handleRangeChange ignores the picker's
    // echo for the same window, so the selected preset/label survives Apply.
    rangeRef.current = { start: new Date(startTime), end: new Date(endTime) };
    setRange({ start: new Date(startTime), end: new Date(endTime) });
    setPreset(dur.id);
    setPresetLabel(dur.label || dur.id);
    setDrillPath([]);
    emitTimeChange(startTime, endTime, basePeriodicity.toLowerCase());
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
  // Comparison Mode (time tab) — only when the engine actually supplied a
  // comparison window. When on, charts render through the SDK's comparison
  // pipeline (current + dashed comparison series + ▲/▼ deviation tooltip).
  // The time-tab Comparison Mode is the master switch; the picker's Compare
  // toggle only selects the comparison RANGE, so it does NOT gate rendering here
  // (gating on it made the overlay/tooltip silently disappear when out of sync).
  // Shift mode is mutually exclusive — when Shift is on, comparison stands down.
  const comparisonOn =
    comparisonModeOn && !shiftOn && Array.isArray(comparisonData) && comparisonData.length > 0;
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

      // Comparison Mode render path — current vs prior-period overlay with the
      // ▲/▼ deviation indicator. Built through the SDK's ComboLineChart (the
      // only chart that carries the comparison render contract).
      // NOTE: ComboLineChart isn't passed plotLines/plotBands, so plot lines
      // (and their axis choice) don't render in comparison mode — by design.
      if (comparisonOn && comparisonData) {
        // Guard the comparison pipeline so a bad data shape can never blank the
        // whole widget — on any error fall through to the normal chart below.
        try {
          const cmp = buildChartComparison(chart, ci, data, comparisonData, perSourceOverrides);
          if (cmp && cmp.sources.length > 0) {
            const { series } = buildComparisonSeries({ sources: cmp.sources, deviationPattern });
            return {
              id: chart._id || `chart-${ci}`,
              label: tabLabel,
              type: chartTabType,
              children: (
                <ComboLineChart
                  bare
                  categories={cmp.categories}
                  comparison={{ series, showDeviation: true, comparisonCategories: cmp.comparisonCategories }}
                  showLegend={showLegend}
                  showDataLabels={showDataLabels}
                  yAxisUnit={config.style.yAxisUnit || undefined}
                  scrollable={scrollable}
                  onChartReady={(instance: unknown) => { chartRef.current = instance; }}
                />
              ),
            };
          }
        } catch (err) {
          console.error('[Comparison] render failed — falling back to the normal chart', err);
        }
      }

      const displayData = buildChartDisplayData(chart, ci, data, config);
      const { resolvedSeries, categories, plotLines, plotBands, yAxisUnit, firstPayload, highchartsOptions } = displayData;

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
        children: <ColumnChartDisplay bare {...sharedChartProps} />,
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

  // In global mode the linked Global Time Picker owns the window, so the widget
  // The fixed-duration chip is only meaningful when the user picked the "fixed"
  // time option. In local mode the window is controlled via the inline date
  // picker (no chip); in global mode the window is owned by the linked Global
  // Time Picker, so the widget shows no local controls and no time label at all.
  const durationSlot = pickerType === 'fixed'
    ? `${presetLabel} · ${effectivePeriodicity}${
        drillPath.length > 0 ? ` › ${drillPath[drillPath.length - 1].label}` : ''
      }`
    : undefined;

  // Only local mode exposes the inline date picker + periodicity selector. For
  // fixed/global the filters slot is omitted entirely (undefined, not an empty
  // fragment) so the SDK Chart reclaims that row for the chart canvas.
  const filtersSlot = isLocalPicker ? (
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
            value={basePeriodicity}
            isOpen={periodicityOpen}
            onClick={() => setPeriodicityOpen((v) => !v)}
          >
            {periodicityOpen && (
              <DropdownMenu>
                <ActionListItemGroup>
                  {availablePeriodicities.map((p) => (
                    <ActionListItem
                      key={p}
                      title={p}
                      selectionType="Single"
                      isSelected={basePeriodicity === p}
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
        <IconButton
          icon={<Settings size={16} />}
          aria-label="Chart settings"
          title="Chart settings"
          size="16"
          onClick={(e) => openMenu(e, 'settings')}
        />
      )}
      {!widgetElements.hideExportIcon && (
        <IconButton
          icon={<Menu size={16} />}
          aria-label="Export chart"
          title="Export chart"
          size="16"
          onClick={(e) => openMenu(e, 'export')}
        />
      )}

      {settingsOpen && createPortal(
        <DropdownMenu className="cc-widget__menu" style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 'max-content', minWidth: 200, zIndex: 500 }}>
          <ActionListItem contentType="SectionHeading" title="Chart Control" />
          <ActionListItem title="Legends"    selectionType="Multiple" isSelected={showLegend}     onClick={() => setShowLegend((v) => !v)} />
          <ActionListItem title="Data Label" selectionType="Multiple" isSelected={showDataLabels} onClick={() => setShowDataLabels((v) => !v)} />
        </DropdownMenu>,
        // Portal into the fullscreen element when active (content portaled to
        // document.body is hidden under the fullscreen view).
        document.fullscreenElement ?? document.body,
      )}
      {exportOpen && createPortal(
        <DropdownMenu className="cc-widget__menu" style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 'max-content', minWidth: 200, zIndex: 500 }}>
            <ActionListItem title={isFullscreen ? 'Exit Full Screen Mode' : 'Open in Full Screen'} selectionType="Single" onClick={handleFullscreen} />
            <ActionListItem contentType="Separator" />
            <ActionListItem contentType="SectionHeading" title="Export" />
            <ActionListItem title="PNG"  selectionType="Single" onClick={() => { handleExport('PNG');  setExportOpen(false); }} />
            <ActionListItem title="JPEG" selectionType="Single" onClick={() => { handleExport('JPEG'); setExportOpen(false); }} />
            <ActionListItem title="SVG"  selectionType="Single" onClick={() => { handleExport('SVG');  setExportOpen(false); }} />
            <ActionListItem title="CSV"  selectionType="Single" onClick={() => { handleExport('CSV');  setExportOpen(false); }} />
            <ActionListItem title="XLSX" selectionType="Single" onClick={() => { handleExport('XLSX'); setExportOpen(false); }} />
        </DropdownMenu>,
        // Portal into the fullscreen element when active (content portaled to
        // document.body is hidden under the fullscreen view).
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
  const actionsEmpty = !infoShown && widgetElements.hideSettingsIcon && widgetElements.hideExportIcon;
  const titleRowEmpty = widgetElements.hideChartTitle && !durationSlot && drillPath.length === 0;
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
      {/* Always render through ChartSwitcher for a consistent title treatment.
          With a single chart there's nothing to switch, so the dropdown chevron
          is hidden + the trigger disabled via `cc-widget--single-view`. */}
      <ChartSwitcher
        breadcrumb={breadcrumbSlot}
        duration={durationSlot}
        filters={filtersSlot}
        actions={actionsSlot}
        className={[
          widgetElements.hideChartTitle ? 'cc-widget--hide-title' : '',
          items.length <= 1 ? 'cc-widget--single-view' : '',
        ].filter(Boolean).join(' ') || undefined}
        items={items}
        activeId={activeId}
        onActiveChange={setActiveChartId}
      />
    </div>
  );
}
