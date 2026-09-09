import { useState, useEffect, useRef, useMemo } from 'react';
import { Tabs, TabItem } from '@faclon-labs/design-sdk/Tabs';
import { ProductAccordionItem } from '@faclon-labs/design-sdk/ProductAccordion';
import { Switch } from '@faclon-labs/design-sdk/Switch';
import { TextInput } from '@faclon-labs/design-sdk/TextInput';
import { Button } from '@faclon-labs/design-sdk/Button';
import { IconButton } from '@faclon-labs/design-sdk/IconButton';
import { Tooltip } from '@faclon-labs/design-sdk/Tooltip';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalLeadingItem } from '@faclon-labs/design-sdk/Modal';
import { TimeTabConfiguration } from '@faclon-labs/design-sdk/TimeTabConfiguration';
import type { TimeTabUIConfig, TimeTabConfigurationProps } from '@faclon-labs/design-sdk/TimeTabConfiguration';
import { UNSTreePicker } from '@faclon-labs/design-sdk/UNSTreePicker';
import type { UNSWorkspace, UNSNode } from '@faclon-labs/design-sdk/UNSTreePicker';
import { SelectInput } from '@faclon-labs/design-sdk/SelectInput';
import { DropdownMenu, ActionListItem, ActionListItemGroup } from '@faclon-labs/design-sdk/DropdownMenu';
import { ColorInput } from '@faclon-labs/design-sdk/ColorPicker';
import { InputFieldHeader } from '@faclon-labs/design-sdk/InputFieldHeader';
import { Divider } from '@faclon-labs/design-sdk/Divider';
import { Radio, RadioGroup } from '@faclon-labs/design-sdk/Radio';
import type { RadioGroupChangeMeta } from '@faclon-labs/design-sdk/Radio';
import { ListCard, ListCardLeadingItem, ListCardTrailingItem } from '@faclon-labs/design-sdk/ListCard';
import { Tag } from '@faclon-labs/design-sdk/Tag';
import { Badge } from '@faclon-labs/design-sdk/Badge';
import { Checkbox, CheckboxGroup } from '@faclon-labs/design-sdk/Checkbox';
import { Edit2, Trash2, Plus, ArrowLeft, Info } from 'react-feather';
import {
  ColumnChartEnvelope,
  ColumnChartUIConfig,
  ChartConfig,
  ColumnChartSeriesConfig,
  FixedSeriesConfig,
  PlotLineConfig,
  PlotLinePeriodicity,
  PlotBandConfig,
  AxisConfig,
  LEFT_AXIS_ID,
  RIGHT_AXIS_ID,
  StackConfig,
  WidgetElementsConfig,
  WidgetAdvancedSettingsConfig,
  WidgetSizeConfig,
  WidgetSizePreset,
  TimeConfig,
  Duration,
  BindingEntry,
} from '../../iosense-sdk/types';
import { useUNSTreePicker } from '../../iosense-sdk/useUNSTreePicker';
import './CombinedBarLineChartConfiguration.css';

interface CombinedBarLineChartConfigurationProps {
  config: ColumnChartEnvelope | undefined;
  authentication?: string;
  onChange: (config: ColumnChartEnvelope) => void;
  onBack?: () => void;

  // Host-injectable UNS picker source (all-or-none). Injected by
  // QuickConfigShell.buildProps in the IOSense host; omitted in the dev harness,
  // where the useUNSTreePicker fallback hook supplies them from the token API.
  unsWorkspaces?: UNSWorkspace[];
  isLoadingWorkspaces?: boolean;
  loadUnsChildren?: (wsId: string, parentId?: string) => Promise<UNSNode[]>;
  searchUnsNodes?: (wsId: string, query: string, limit?: number) => Promise<UNSNode[]>;

  // Global Time Pickers registered in the host (Angular shell). Injected at
  // runtime and forwarded to the design-sdk TimeTabConfiguration so the user
  // can link the widget's time to a dashboard-level global picker.
  globalTimepickers?: TimeTabConfigurationProps['globalTimepickers'];
}

const VARIABLE_REGEX = /^\{\{(.+)\}\}$/;

// Sanitizers that keep a configurator number field non-negative: they strip a
// leading minus (and any other non-numeric characters), so no number input can
// ever hold a negative value. `nonNegIntStr` is for whole numbers;
// `nonNegDecimalStr` keeps a single decimal point for fractional values.
function nonNegIntStr(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}
function nonNegDecimalStr(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const dot = cleaned.indexOf('.');
  return dot === -1 ? cleaned : cleaned.slice(0, dot + 1) + cleaned.slice(dot + 1).replace(/\./g, '');
}
const WIDGET_SIZE_PRESETS: Record<'Small' | 'Medium' | 'Large', { width: number; height: number }> = {
  Small:  { width: 400, height: 300 },
  Medium: { width: 600, height: 400 },
  Large:  { width: 880, height: 500 },
};
const WIDGET_SIZE_OPTIONS: WidgetSizePreset[] = ['Small', 'Medium', 'Large', 'Custom'];
const DEFAULT_ADVANCED_SETTINGS: WidgetAdvancedSettingsConfig = {
  enabled: true,
  titleFontSize: 20,
  titleFontColor: '#1A1A1A',
  titleFontWeight: 'Semi-Bold',
  xAxisTextColor: '#1A1A1A',
  xAxisLineColor: '#333333',
  yAxisTextColor: '#1A1A1A',
  gridLineColor: '#CCCCCC',
  legendTextColor: '#1A1A1A',
};

function buildDynamicBindingPathList(
  uiConfig: unknown,
  seriesKeys: string[],
): Array<BindingEntry> {
  const paths: Array<BindingEntry> = [];

  function walk(obj: unknown, currentPath: string): void {
    if (obj === null || obj === undefined) return;
    if (typeof obj === 'string') {
      const match = VARIABLE_REGEX.exec(obj.trim());
      if (match) {
        const topic = match[1];
        if (seriesKeys.includes(currentPath)) {
          paths.push({ key: currentPath, topic, type: 'series' });
        } else {
          paths.push({ key: currentPath, topic });
        }
      }
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => walk(item, `${currentPath}[${index}]`));
      return;
    }
    if (typeof obj === 'object') {
      Object.entries(obj as Record<string, unknown>).forEach(([key, val]) => {
        walk(val, currentPath ? `${currentPath}.${key}` : key);
      });
    }
  }

  walk(uiConfig, '');
  return paths;
}

type GlobalTimepickerList = TimeTabConfigurationProps['globalTimepickers'];

function mapTimeTabToTimeConfig(
  ttc: TimeTabUIConfig,
  globalTimepickers?: GlobalTimepickerList,
): TimeConfig {
  // New design uses `linkTimeWith` ('local' | 'fixed' | 'global'); fall back to
  // the deprecated `timeType` for back-compat.
  const picker = ((ttc.linkTimeWith ?? ttc.timeType ?? 'local') as 'local' | 'fixed' | 'global');

  // Fixed picker carries a single inline "set duration" (ttc.fixed.duration)
  // with string x/y. Convert to a Duration the engine/widget can resolve.
  const fd = ttc.fixed?.duration;
  const fixedDuration: Duration | undefined =
    picker === 'fixed' && fd
      ? {
          id: 'fixed',
          label: fd.name || 'Fixed',
          navigation: fd.navigation,
          x: Number(fd.x) || 0,
          xPeriod: fd.xPeriod,
          xEvent: fd.xEvent,
          y: Number(fd.y) || 0,
          yPeriod: fd.yPeriod,
          yEvent: fd.yEvent,
        }
      : undefined;

  // Global picker: the durations / defaultDurationId / cycleTime / timezone are
  // INHERITED from the linked Global Time Picker (TimeTab only emits the GTP id
  // under `global.globalTimepickerId`; the rest lives in the `globalTimepickers`
  // prop). Bake them in so the engine can resolve a fallback window and the
  // widget can display the link. At runtime the host overrides this with the
  // GTP's live broadcast window via ctx.globalTimeWindow.
  const globalId = ttc.global?.globalTimepickerId ?? ttc.globalTimepickerId;
  const linkedGtp = picker === 'global'
    ? (globalTimepickers ?? []).find((g) => g.id === globalId)
    : undefined;

  // Where the comparison settings (deviation pattern + Advanced per-source) live
  // for the active picker: fixed → ttc.fixed, global → ttc.global, local → top.
  type DevPattern = 'green-up-positive' | 'red-up-positive';
  const cmpScope = (picker === 'fixed' ? ttc.fixed : picker === 'global' ? ttc.global : ttc) as
    | { comparisonMode?: boolean; deviationPattern?: DevPattern; allowPerSourceIndicator?: boolean; sourceDeviationOverrides?: Record<string, DevPattern>; defaultDisplayMode?: TimeConfig['defaultDisplayMode'] }
    | undefined;

  // Shifts live with the picker: fixed → ttc.fixed, global → the linked GTP,
  // local → top level. When shifts are configured the aggregator defaults to
  // "max" (if the source didn't set one).
  const shiftScope = (picker === 'fixed' ? ttc.fixed : picker === 'global' ? linkedGtp : ttc) as
    | { shifts?: TimeConfig['shifts']; shiftAggregator?: string }
    | undefined;
  // Stamp `enabled: true` on every configured shift. The backend's shift
  // breakdown (one value per bucket PER SHIFT) only kicks in when each shift
  // carries this flag — without it the engine returns a single un-split value
  // per bucket, so the chart can only ever show one shift. The working
  // ColumnChart configurator does exactly this; ours was sending shifts verbatim
  // (no `enabled`), which is why the shift view never split into A/B/C.
  const shifts = (shiftScope?.shifts ?? []).map((s) => ({ ...s, enabled: true }));
  const shiftAggregator = shifts.length > 0
    ? (shiftScope?.shiftAggregator || 'max')
    : shiftScope?.shiftAggregator;

  // Cycle time redefines when each period "begins" so durations resolve to the
  // operational window, not the calendar one (hour:minute = day, dayOfWeek =
  // week, date = month, month NAME = year). The resolver reads these raw fields
  // directly (mirroring the GlobalTimePicker reference), so pass them through
  // unchanged. Fixed scopes cycleTime under `fixed`; global inherits the GTP's;
  // local keeps it at the top level.
  const cycleTime = (picker === 'fixed'
    ? ttc.fixed?.cycleTime
    : picker === 'global'
    ? (linkedGtp?.cycleTime ?? ttc.cycleTime)
    : ttc.cycleTime) as TimeConfig['cycleTime'] | undefined;

  // Resolve the duration list + default per picker. Global inherits from the
  // linked GTP; fixed/local use the tab's own list.
  const allDurations = (picker === 'global' && linkedGtp?.allDurations
    ? linkedGtp.allDurations
    : (ttc.allDurations ?? [])) as unknown as Duration[];
  const defaultDurationId = picker === 'global'
    ? (linkedGtp?.defaultDurationId ?? ttc.defaultDurationId)
    : ttc.defaultDurationId;

  return {
    // Timezone is SCOPED per picker, matching where the SDK TimeTab stores it:
    // global → inherited from the linked GTP; fixed → under `ttc.fixed.timezone`
    // (the Fixed section's dropdown emits into the fixed scope); local → top level.
    // Reading top-level for fixed left the emitted timezone stale until a reload.
    timezone: (picker === 'global'
      ? (linkedGtp?.timezone ?? ttc.timezone)
      : picker === 'fixed'
      ? ((ttc.fixed as { timezone?: string } | undefined)?.timezone ?? ttc.timezone)
      : ttc.timezone),
    // Preserve the real picker mode in both `type` and `pickerType`. Global no
    // longer masquerades as local — the engine branches on `pickerType` to pull
    // the window from ctx.globalTimeWindow.
    type: picker,
    pickerType: picker,
    cycleTime,
    startTime: null,
    endTime: null,
    fixedDuration,
    globalTimepickerId: picker === 'global' ? globalId : undefined,
    globalTimepickerName: picker === 'global' ? linkedGtp?.name : undefined,
    defaultDurationId,
    allDurations,
    // Fixed has its own single periodicity; otherwise use the tab default.
    defaultPeriodicity: (picker === 'fixed' && fd?.periodicity
      ? fd.periodicity.toLowerCase()
      : (ttc.defaultPeriodicity ?? 'daily')) as TimeConfig['defaultPeriodicity'],
    // "Disable Periodicities" switch — fixed scopes it under `fixed`, local at
    // the top level. When on, the widget hides its periodicity dropdown.
    disablePeriodicities: picker === 'fixed'
      ? Boolean(ttc.fixed?.disablePeriodicities)
      : Boolean(ttc.disablePeriodicities),
    // Comparison settings are SCOPED per picker: fixed → ttc.fixed,
    // global → ttc.global, local → top level. In Global mode the comparison
    // ON/OFF is INHERITED from the linked GTP (read-only), but the deviation
    // pattern + Advanced (per-source) settings stay user-editable per widget
    // (stored under ttc.global), exactly like the local picker.
    comparisonMode: picker === 'global'
      ? Boolean(linkedGtp?.comparisonMode ?? cmpScope?.comparisonMode)
      : Boolean(cmpScope?.comparisonMode),
    deviationPattern: cmpScope?.deviationPattern as TimeConfig['deviationPattern'],
    allowPerSourceIndicator: Boolean(cmpScope?.allowPerSourceIndicator),
    // Per-source polarity overrides (Advanced Settings) — same scope.
    sourceDeviationOverrides: cmpScope?.sourceDeviationOverrides as TimeConfig['sourceDeviationOverrides'],
    // Shifts + aggregator (default "max" when shifts are configured).
    shifts,
    shiftAggregator,
    // Default view mode ("normal" | "comparison" | "shift") chosen in the time
    // tab — same scope as comparisonMode. Drives the widget's initial view.
    defaultDisplayMode: (picker === 'global'
      ? ((linkedGtp as { defaultDisplayMode?: TimeConfig['defaultDisplayMode'] } | undefined)?.defaultDisplayMode ?? cmpScope?.defaultDisplayMode)
      : cmpScope?.defaultDisplayMode) as TimeConfig['defaultDisplayMode'],
  };
}

// Sensible "start of calendar period" defaults for the Cycle Time form so it
// never renders blank: calendar type, start-of-period at 00:00, Monday week
// start, 1st of the month, January year start. Applied idempotently — any field
// the user has set is preserved; only blanks are filled, so it never fights
// edits. Filled for the LOCAL (top-level `cycleTime`) and FIXED (`fixed.cycleTime`)
// pickers; global inherits the GTP's cycle time (read-only) so it's left alone.
function fillCycleDefaults(ct: Record<string, unknown> | undefined): Record<string, unknown> {
  const c = ct ?? {};
  return {
    cycleTimeType: c.cycleTimeType || 'calendar',
    identifier:    c.identifier    || 'start',
    hour:          c.hour          || '00',
    minute:        c.minute        || '00',
    dayOfWeek:     c.dayOfWeek == null ? 1 : c.dayOfWeek,   // 1 = Monday
    date:          c.date          || '1',
    month:         c.month         || '1',                  // January (calendar year start)
    year:          c.year ?? '',
  };
}

function withCycleDefaults<T extends Record<string, unknown> | undefined>(ttc: T): T {
  if (!ttc) return ttc;
  const picker = (ttc.linkTimeWith ?? ttc.timeType ?? 'local') as string;
  if (picker === 'fixed') {
    const fixed = (ttc.fixed ?? {}) as Record<string, unknown>;
    return { ...ttc, fixed: { ...fixed, cycleTime: fillCycleDefaults(fixed.cycleTime as Record<string, unknown> | undefined) } } as T;
  }
  if (picker === 'local') {
    return { ...ttc, cycleTime: fillCycleDefaults(ttc.cycleTime as Record<string, unknown> | undefined) } as T;
  }
  return ttc; // global → cycle time inherited from the GTP (read-only)
}

function buildEnvelope(
  existing: ColumnChartEnvelope | undefined,
  uiConfig: ColumnChartUIConfig,
  timeConfig?: TimeConfig,
  timeTabConfig?: Record<string, unknown>,
): ColumnChartEnvelope {
  const seriesKeys = uiConfig.charts.flatMap((chart, ci) =>
    chart.series.map((_, si) => `charts[${ci}].series[${si}].unsPath`)
  );
  const envelope: ColumnChartEnvelope = {
    _id: existing?._id ?? `widget_${Date.now()}`,
    type: 'ColumnChart',
    general: { title: uiConfig.title },
    uiConfig,
    dynamicBindingPathList: buildDynamicBindingPathList(uiConfig, seriesKeys),
  };
  if (timeConfig) envelope.timeConfig = timeConfig;
  if (timeTabConfig) envelope.timeTabConfig = timeTabConfig;
  return envelope;
}

type ActiveTab = 'data' | 'time' | 'style';
type ModalSection = 'series' | 'fixed' | 'plotLine' | 'plotBand' | 'axis' | 'stack';

type EditMode = 'none' | 'edit-existing' | 'edit-new';

// Default series colors, cycled per data source so each one a user adds gets a
// distinct color out of the box (still editable in the modal).
const SERIES_COLOR_PALETTE = [
  '#3366FF', '#FF6B35', '#22C55E', '#A855F7', '#EAB308',
  '#EC4899', '#06B6D4', '#EF4444', '#14B8A6', '#F97316',
];

function nextSeriesColor(chart: ChartConfig | undefined): string {
  const used = (chart?.series.length ?? 0) + (chart?.fixedSeries.length ?? 0);
  return SERIES_COLOR_PALETTE[used % SERIES_COLOR_PALETTE.length];
}

// The design-sdk Add/Edit Shift panel only enforces a non-empty name; it never
// checks name uniqueness, empty (start == end) windows, or gives each shift a
// distinct colour (it defaults every new shift to the same colour). Enforce the
// rest here, on the shifts the TimeTab emits, before they persist / render:
//   • drop shifts with no name (mandatory — belt & suspenders with the SDK)
//   • drop duplicate names (case-insensitive, trimmed) — keep the first
//   • drop empty windows where startTime === endTime (e.g. 00:00–00:00)
//   • give each shift a distinct colour: keep the picked colour unless it's
//     missing or collides with an earlier shift's, then take the next unused
//     palette colour (so adding a shift auto-advances its colour).
// HH:MM windows are inherently within a 24-hour clock (a night shift like
// 22:00–06:00 is a valid < 24h span), so "within 24hr" needs no extra check.
interface RawShift { id?: string; name?: string; color?: string; startTime?: string; endTime?: string; }
function sanitizeShifts(shifts: RawShift[]): RawShift[] {
  const seenNames = new Set<string>();
  const usedColors = new Set<string>();
  const out: RawShift[] = [];
  for (const s of shifts) {
    const name = (s.name ?? '').trim();
    if (!name) continue;                                   // mandatory
    const nameKey = name.toLowerCase();
    if (seenNames.has(nameKey)) continue;                  // unique
    // Do NOT drop for the window here: the SDK creates a new shift with default
    // (often equal) start/end times BEFORE the user has set them, and this
    // sanitizer runs on every onChange — silently dropping such a shift made it
    // impossible to finish adding one, so it never persisted (shifts:[] in the
    // resolve request). Window validity is the user's to fix in the panel.
    seenNames.add(nameKey);
    let color = s.color;
    if (!color || usedColors.has(color)) {
      color = SERIES_COLOR_PALETTE.find((c) => !usedColors.has(c))
        ?? SERIES_COLOR_PALETTE[out.length % SERIES_COLOR_PALETTE.length];
    }
    usedColors.add(color);
    out.push({ ...s, name, color });
  }
  return out;
}

// ── Axis helpers ────────────────────────────────────────────────────────────
// Model: a chart always has a default Left axis (yAxis 0) that can be renamed
// but not deleted. A Right axis (yAxis 1) is optional and exists only while it
// owns ≥1 data source. Every series belongs to exactly one axis; series.yAxis
// mirrors that membership. The widget auto-hides an axis with no series.

function makeLeftAxis(seriesIds: string[] = []): AxisConfig {
  // Empty name by default → no axis title rendered (falls back to yAxisUnit).
  // The configurator list shows "Left Axis" as a fallback display label.
  return { _id: LEFT_AXIS_ID, name: '', yAxis: 0, seriesIds };
}

function rightIdsOf(chart: ChartConfig): string[] {
  return (chart.axes ?? []).find((a) => a.yAxis === 1)?.seriesIds ?? [];
}

// Rebuild a chart's axes + per-series yAxis from a desired set of Right-axis
// ids. Left = everything else. The Right axis is dropped when it would be empty.
function syncAxes(
  chart: ChartConfig,
  rightIdsInput: Iterable<string>,
  opts: { leftName?: string; rightName?: string } = {},
): ChartConfig {
  const allIds = [
    ...chart.series.map((s) => s._id),
    ...chart.fixedSeries.map((s) => s._id),
  ];
  const rightIds = new Set(Array.from(rightIdsInput).filter((id) => allIds.includes(id)));
  const leftIds = allIds.filter((id) => !rightIds.has(id));
  const existingLeft = (chart.axes ?? []).find((a) => a.yAxis === 0);
  const existingRight = (chart.axes ?? []).find((a) => a.yAxis === 1);

  const axes: AxisConfig[] = [
    { _id: LEFT_AXIS_ID, name: opts.leftName ?? existingLeft?.name ?? '', yAxis: 0, seriesIds: leftIds },
  ];
  if (rightIds.size > 0) {
    axes.push({
      _id: RIGHT_AXIS_ID,
      name: opts.rightName ?? existingRight?.name ?? '',
      yAxis: 1,
      seriesIds: Array.from(rightIds),
    });
  }

  const yAxisFor = (id: string): 0 | 1 => (rightIds.has(id) ? 1 : 0);
  return {
    ...chart,
    axes,
    series: chart.series.map((s) => ({ ...s, yAxis: yAxisFor(s._id) })),
    fixedSeries: chart.fixedSeries.map((s) => ({ ...s, yAxis: yAxisFor(s._id) })),
  };
}

// Guarantee the axis invariants on load (back-fills old `axes: []` configs).
function normalizeChart(chart: ChartConfig): ChartConfig {
  const existingRight = (chart.axes ?? []).find((a) => a.yAxis === 1);
  const rightIds = new Set<string>(existingRight?.seriesIds ?? []);
  chart.series.forEach((s) => { if (s.yAxis === 1) rightIds.add(s._id); });
  chart.fixedSeries.forEach((s) => { if (s.yAxis === 1) rightIds.add(s._id); });
  return syncAxes(chart, rightIds);
}

// Remove a deleted series id from the chart and re-sync axis membership.
function removeSeriesEverywhere(chart: ChartConfig, id: string): Partial<ChartConfig> {
  const next = {
    ...chart,
    series: chart.series.filter((s) => s._id !== id),
    fixedSeries: chart.fixedSeries.filter((s) => s._id !== id),
  };
  const synced = syncAxes(next, rightIdsOf(chart).filter((x) => x !== id));
  return { series: synced.series, fixedSeries: synced.fixedSeries, axes: synced.axes };
}

// Delete the Right axis — its series fall back to the default Left axis. Plot
// lines/bands that were pinned to the right axis re-home to the left too, so
// none of them dangle on a non-existent axis.
function deleteRightAxis(chart: ChartConfig): Partial<ChartConfig> {
  const synced = syncAxes(chart, []);
  return {
    series: synced.series,
    fixedSeries: synced.fixedSeries,
    axes: synced.axes,
    plotLines: chart.plotLines.map((p) => (p.yAxis === 1 ? { ...p, yAxis: 0 } : p)),
    plotBands: chart.plotBands.map((p) => (p.yAxis === 1 ? { ...p, yAxis: 0 } : p)),
  };
}

function makeChart(overrides: Partial<ChartConfig> = {}): ChartConfig {
  return {
    _id: `chart_${Date.now()}`,
    title: '',
    description: undefined,
    series: [],
    fixedSeries: [],
    axes: [makeLeftAxis()],
    stacks: [],
    plotLines: [],
    plotBands: [],
    ...overrides,
  };
}

// Stable empty chart the downstream sections read from when nothing is
// committed yet, so they always render (disabled) without null-checks.
const EMPTY_SECTION_CHART: ChartConfig = {
  _id: '__empty__',
  title: '',
  description: undefined,
  series: [],
  fixedSeries: [],
  axes: [makeLeftAxis()],
  stacks: [],
  plotLines: [],
  plotBands: [],
};

export function CombinedBarLineChartConfiguration(props: CombinedBarLineChartConfigurationProps) {
  const { config, authentication, onChange, onBack, globalTimepickers } = props;

  // Host injects workspaces + loadChildren together; if it does, use those.
  // Otherwise fall back to the dev-harness hook (called unconditionally per the
  // Rules of Hooks; it no-ops when the host has injected).
  const hasInjectedUNS =
    props.unsWorkspaces !== undefined && props.loadUnsChildren !== undefined;

  const hookResult = useUNSTreePicker(hasInjectedUNS ? undefined : authentication);
  const unsWorkspaces       = hasInjectedUNS ? props.unsWorkspaces!                     : hookResult.workspaces;
  const isLoadingWorkspaces = hasInjectedUNS ? (props.isLoadingWorkspaces ?? false)     : hookResult.isLoadingWorkspaces;
  const loadUnsChildren     = hasInjectedUNS ? props.loadUnsChildren!                   : hookResult.loadChildren;
  const searchUnsNodes      = hasInjectedUNS ? (props.searchUnsNodes ?? hookResult.searchNodes) : hookResult.searchNodes;

  const [activeTab, setActiveTab] = useState<ActiveTab>('data');

  // ── Charts list + which one is active ────────────────────────────────────
  // The charts array can be empty — that is the canonical "Empty / first chart"
  // state (State 1). We never seed a placeholder chart.
  const initCharts = (config?.uiConfig?.charts ?? []).map(normalizeChart);
  const [chartsList,       setChartsList]       = useState<ChartConfig[]>(initCharts);
  const [selectedChartId,  setSelectedChartId]  = useState<string | null>(initCharts[0]?._id ?? null);
  const [chartPickerOpen,  setChartPickerOpen]  = useState(false);

  // ── Expanded sections for the selected chart ──────────────────────────────
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // ── Widget-level state ────────────────────────────────────────────────────
  const [currentTimeConfig,    setCurrentTimeConfig]    = useState<TimeConfig | undefined>(config?.timeConfig);
  const [currentTimeTabConfig, setCurrentTimeTabConfig] = useState<Record<string, unknown> | undefined>(config?.timeTabConfig);
  // TimeTabConfiguration's `value` prop is a rehydration SEED ("restores a
  // saved config"), not a controlled value — passing its own onChange output
  // back in resets its internal UI state (open side popups like Edit Duration)
  // on every toggle. The seed is therefore only (re)set on events that can't
  // have a popup open: initial mount, widget switch, and entering the Time tab.
  // It is never reset from echoes of what the time tab itself just emitted.
  const [timeTabSeed, setTimeTabSeed] = useState<Record<string, unknown> | undefined>(config?.timeTabConfig);
  // Bumped ONLY on a timezone change to force-remount TimeTabConfiguration. The
  // SDK's timezone dropdown doesn't reliably reflect a new selection from its own
  // internal state (the old value persists), so — like the working PieChart — we
  // re-seed with the new value and remount via this key. A timezone pick closes
  // its own dropdown, so there's no other open popup for the remount to disrupt.
  const [timeTabRemountKey, setTimeTabRemountKey] = useState(0);
  const [title,          setTitle]          = useState(config?.uiConfig?.title ?? '');
  const [description,    setDescription]    = useState(config?.uiConfig?.description ?? '');
  const [titleTouched,   setTitleTouched]   = useState(false);

  // ── Chart Settings state machine ───────────────────────────────────────────
  // chartsList is the committed source of truth — the ONLY thing emitted
  // upstream (via commitState). pendingChart and draft are throwaway scratch
  // buffers that NEVER emit, so Empty/Editing work can be cancelled cleanly:
  //   • pendingChart → scratch buffer for the very first chart (Empty mode)
  //   • draft        → scratch buffer while adding/editing (Editing mode)
  //   • editMode     → 'none' | 'edit-existing' | 'edit-new'
  const [pendingChart, setPendingChart] = useState<ChartConfig>(() => makeChart());
  const [draft,        setDraft]        = useState<ChartConfig | null>(null);
  const [editMode,     setEditMode]     = useState<EditMode>('none');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // Generic delete confirmation for list items (data source, axis, plot line,
  // plot band). Holds the modal copy + the action to run on confirm.
  const [pendingDelete, setPendingDelete] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [wrapInCard,     setWrapInCard]     = useState(config?.uiConfig?.style?.card?.wrapInCard ?? true);
  const [stacked,        setStacked]        = useState(config?.uiConfig?.style?.stacked ?? false);
  const [showLegend,     setShowLegend]     = useState(config?.uiConfig?.style?.showLegend ?? true);
  const [showDataLabels, setShowDataLabels] = useState(config?.uiConfig?.style?.showDataLabels ?? false);
  const [scroll,         setScroll]         = useState(config?.uiConfig?.style?.scroll ?? false);
  const [yAxisUnit,      setYAxisUnit]      = useState(config?.uiConfig?.style?.yAxisUnit ?? '');

  // ── Widget size ───────────────────────────────────────────────────────────
  const initSize = config?.uiConfig?.style?.widgetSize;
  const [sizePreset, setSizePreset] = useState<WidgetSizePreset>(initSize?.preset ?? 'Custom');
  const [sizeWidth,  setSizeWidth]  = useState<number>(initSize?.width  ?? 880);
  const [sizeHeight, setSizeHeight] = useState<number>(initSize?.height ?? 400);
  const [sizeLocked, setSizeLocked] = useState<boolean>(initSize?.locked ?? false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);

  // ── Wrap-in-card styling ──────────────────────────────────────────────────
  const initCard = config?.uiConfig?.style?.card;
  const [cardBg,           setCardBg]           = useState<string>(initCard?.backgroundColor ?? '#FFFFFF');
  const [cardBorderColor,  setCardBorderColor]  = useState<string>(initCard?.borderColor ?? '#FFFFFF');
  const [cardBorderWidth,  setCardBorderWidth]  = useState<number>(initCard?.borderWidth ?? 1);
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(initCard?.borderRadius ?? 4);
  const [widgetElementsEnabled, setWidgetElementsEnabled] = useState(
    Boolean(
      config?.uiConfig?.style?.widgetElements?.hideWidgetElements ||
      config?.uiConfig?.style?.widgetElements?.hideSettingsIcon ||
      config?.uiConfig?.style?.widgetElements?.hideExportIcon ||
      config?.uiConfig?.style?.widgetElements?.hideChartTitle ||
      config?.uiConfig?.style?.widgetElements?.hideInfoIcon,
    ),
  );
  const [hideSettingsIcon, setHideSettingsIcon] = useState(config?.uiConfig?.style?.widgetElements?.hideSettingsIcon ?? false);
  const [hideExportIcon,   setHideExportIcon]   = useState(config?.uiConfig?.style?.widgetElements?.hideExportIcon ?? false);
  const [hideChartTitle,   setHideChartTitle]   = useState(config?.uiConfig?.style?.widgetElements?.hideChartTitle ?? false);
  const [hideInfoIcon,     setHideInfoIcon]     = useState(config?.uiConfig?.style?.widgetElements?.hideInfoIcon ?? false);
  const [advancedSettings, setAdvancedSettings] = useState<WidgetAdvancedSettingsConfig>({
    ...DEFAULT_ADVANCED_SETTINGS,
    ...(config?.uiConfig?.style?.advancedSettings ?? {}),
  });
  const [advancedTitleWeightOpen, setAdvancedTitleWeightOpen] = useState(false);
  // Title font-size is edited as a raw string so the field can go empty / hold a
  // partial value mid-edit (e.g. after backspacing "20" to "" to type "18").
  // A controlled numeric value coerced every keystroke can never be cleared and
  // snaps back to the default. Only a valid positive number is committed to
  // advancedSettings; clearing leaves the last committed size until a new one is
  // typed. Kept in sync when the committed size changes (load / external update).
  const [titleFontSizeInput, setTitleFontSizeInput] = useState(String(config?.uiConfig?.style?.advancedSettings?.titleFontSize ?? DEFAULT_ADVANCED_SETTINGS.titleFontSize));
  useEffect(() => {
    setTitleFontSizeInput(String(advancedSettings.titleFontSize));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advancedSettings.titleFontSize]);

  // ── Modal state ───────────────────────────────────────────────────────────
  const configRef = useRef<HTMLDivElement>(null);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [modalChartId, setModalChartId] = useState<string | null>(null);
  const [modalSection, setModalSection] = useState<ModalSection>('series');
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [modalX,       setModalX]       = useState(0);
  const [modalY,       setModalY]       = useState(0);
  const [formUnsPath,  setFormUnsPath]  = useState('');
  const [formLabel,    setFormLabel]    = useState('');
  const [formColor,    setFormColor]    = useState('');
  const [formUnit,      setFormUnit]      = useState('');
  const [formPrecision, setFormPrecision] = useState('');
  // Bar+line: per-series render type (Combined-specific).
  const [formChartType,     setFormChartType]     = useState<'Column' | 'Line'>('Column');
  const [formChartTypeOpen, setFormChartTypeOpen] = useState(false);
  const [formValue,    setFormValue]    = useState('');
  const [formFrom,     setFormFrom]     = useState('');
  const [formTo,       setFormTo]       = useState('');
  const [formWidth,    setFormWidth]    = useState('');
  // Which axis a plot line / plot band draws against (only offered when the
  // chart has a Right axis). Shared by both modals — one is open at a time.
  const [formPlotYAxis, setFormPlotYAxis] = useState<0 | 1>(0);
  const [formDashStyle,               setFormDashStyle]               = useState('');
  const [formDashStylePickerOpen,     setFormDashStylePickerOpen]     = useState(false);
  const [formAxisName,                setFormAxisName]                = useState('');
  const [formAxisYAxis,               setFormAxisYAxis]               = useState<0 | 1>(0);
  const [formAxisSeriesIds,           setFormAxisSeriesIds]           = useState<string[]>([]);
  const [formAxisSeriesDropdownOpen,   setFormAxisSeriesDropdownOpen]   = useState(false);
  const [formStackName,               setFormStackName]               = useState('');
  const [formStackSeriesIds,          setFormStackSeriesIds]          = useState<string[]>([]);
  const [formStackSeriesDropdownOpen, setFormStackSeriesDropdownOpen] = useState(false);
  const [formPeriodicityType,         setFormPeriodicityType]         = useState<'independent' | 'dependent'>('independent');
  const [formPeriodicities,           setFormPeriodicities]           = useState<PlotLinePeriodicity[]>([]);
  const [formCurrentPeriodicity,      setFormCurrentPeriodicity]      = useState('');
  const [formPeriodicityDropdownOpen, setFormPeriodicityDropdownOpen] = useState(false);

  // Style tab accordion expanded state
  const [styleGeneralExpanded, setStyleGeneralExpanded] = useState(false);
  const [styleChartExpanded,   setStyleChartExpanded]   = useState(false);


  useEffect(() => {
    if (config) {
      const charts = (config.uiConfig?.charts ?? []).map(normalizeChart);
      setChartsList(charts);
      setSelectedChartId(charts[0]?._id ?? null);
      setTitle(charts[0]?.title ?? config.uiConfig?.title ?? '');
      setDescription(charts[0]?.description ?? config.uiConfig?.description ?? '');
      setPendingChart(makeChart());
      setDraft(null);
      setEditMode('none');
      setTitleTouched(false);
      setWrapInCard(config.uiConfig?.style?.card?.wrapInCard ?? true);
      setCardBg(config.uiConfig?.style?.card?.backgroundColor ?? '#FFFFFF');
      setCardBorderColor(config.uiConfig?.style?.card?.borderColor ?? '#FFFFFF');
      setCardBorderWidth(config.uiConfig?.style?.card?.borderWidth ?? 1);
      setCardBorderRadius(config.uiConfig?.style?.card?.borderRadius ?? 4);
      const nextSize = config.uiConfig?.style?.widgetSize;
      setSizePreset(nextSize?.preset ?? 'Custom');
      setSizeWidth(nextSize?.width ?? 880);
      setSizeHeight(nextSize?.height ?? 400);
      setSizeLocked(nextSize?.locked ?? false);
      setStacked(config.uiConfig?.style?.stacked ?? false);
      setShowLegend(config.uiConfig?.style?.showLegend ?? true);
      setShowDataLabels(config.uiConfig?.style?.showDataLabels ?? false);
      setScroll(config.uiConfig?.style?.scroll ?? false);
      setYAxisUnit(config.uiConfig?.style?.yAxisUnit ?? '');
      const nextWidgetElements = config.uiConfig?.style?.widgetElements ?? {
        hideWidgetElements: false,
        hideSettingsIcon: false,
        hideExportIcon: false,
        hideChartTitle: false,
        hideInfoIcon: false,
      };
      setWidgetElementsEnabled(
        nextWidgetElements.hideWidgetElements ||
        nextWidgetElements.hideSettingsIcon ||
        nextWidgetElements.hideExportIcon ||
        nextWidgetElements.hideChartTitle ||
        nextWidgetElements.hideInfoIcon,
      );
      setHideSettingsIcon(nextWidgetElements.hideSettingsIcon);
      setHideExportIcon(nextWidgetElements.hideExportIcon);
      setHideChartTitle(nextWidgetElements.hideChartTitle);
      setHideInfoIcon(nextWidgetElements.hideInfoIcon ?? false);
      setAdvancedSettings({
        ...DEFAULT_ADVANCED_SETTINGS,
        ...(config.uiConfig?.style?.advancedSettings ?? {}),
      });
      setAdvancedTitleWeightOpen(false);
      setCurrentTimeConfig(config.timeConfig);
      setCurrentTimeTabConfig(config.timeTabConfig);
      setTimeTabSeed(config.timeTabConfig);
    }
  }, [config?._id]);

  useEffect(() => {
    if (config?.timeConfig !== undefined) setCurrentTimeConfig(config.timeConfig);
  }, [config?.timeConfig]);

  useEffect(() => {
    if (config?.timeTabConfig !== undefined) {
      // Track the latest committed time config, but DO NOT reseed the TimeTab
      // here. `TimeTabConfiguration.value` is a rehydration SEED — changing its
      // identity makes the SDK re-hydrate and CLOSE any open side popup (e.g.
      // Edit/Add Duration). Every keystroke/checkbox we emit bounces back
      // through the host's update() as a new `config` object, and on the
      // iosense host the echoed timeTabConfig isn't byte-identical to what we
      // emitted (the platform normalises/augments it), so no content guard can
      // reliably tell "our own echo" from a real change. Reseeding mid-edit
      // only ever destroys the user's in-progress edits and closes the popup,
      // so we don't do it. The seed is (re)hydrated where it's actually safe:
      // initial mount (useState initializer), widget switch (config._id effect),
      // and entering the Time tab (Tabs.onValueChange) — none of which can have
      // a popup open.
      setCurrentTimeTabConfig(config.timeTabConfig);
    }
  }, [config?.timeTabConfig]);

  // Workaround for a design-sdk (>= 0.7.7) regression that closes the
  // TimeTabConfiguration / configurator side modals (Add/Edit Duration, Add
  // Shift, Add Data Source, …) the instant you interact with a pop-out surface
  // inside them: the Start/End Hour+Minute selects (a portaled `DropdownMenu`,
  // `.fds-dropdown-menu`), the Periodicity / generic `SelectInput` dropdowns
  // (`.fds-select-input__popover`), the shift-colour `ColorInput`
  // (`.fds-color-input__popover`) and the UNS pickers
  // (`.fds-uns-tree-picker__popover`) all render their popover through a portal
  // OUTSIDE the modal's DOM. Clicking an option/hour/swatch therefore reads as
  // "outside the modal" and dismisses it. (Worked in 0.7.3, where these popovers
  // stayed within the modal.)
  //
  // Fix (ported verbatim from the working ColumnChart widget): ONE bubble-phase
  // (NOT capture) `document` listener that inspects `event.composedPath()` — the
  // event's real ancestor chain, accurate regardless of portals — and, when any
  // ancestor matches a popover selector, calls BOTH `stopPropagation()` AND
  // `preventDefault()`:
  //   • `stopPropagation()` pre-empts the SDK's own outside-click check (also a
  //     bubble-phase `document` mousedown listener, per useClickOutside.js) —
  //     same-node same-phase listeners fire in REGISTRATION ORDER, and this
  //     effect mounts with the whole configurator, before any modal can open,
  //     so it always registers first.
  //   • `preventDefault()` is the KEY the earlier stopPropagation-only versions
  //     missed. The Add-Shift dropdown does NOT dismiss via a mousedown
  //     outside-click listener at all — it dismisses via a FOCUS TRAP
  //     (blur/focusout). A mousedown's native DEFAULT ACTION moves
  //     `document.activeElement` to the clicked option, which lives in a portal
  //     outside the panel, so focus "escapes" the panel boundary and the trap
  //     closes it — before `click` (the actual selection) even fires. Stopping
  //     propagation can't stop a native focus shift; `preventDefault()` on the
  //     mousedown suppresses it so the field stays focused. `click` still fires
  //     normally afterward (a preceding mousedown's preventDefault doesn't block
  //     it), so selection keeps working.
  // Bubble phase is deliberate: the event has already reached and been handled
  // by its real target (the option / colour canvas) before it bubbles up to
  // `document`, so nothing in the popover loses its own interaction — a capture
  // guard would swallow those before the target ever sees them. Remove once the
  // SDK ships a fix.
  useEffect(() => {
    const SELECTORS = ['.fds-select-input__popover', '.fds-color-input__popover', '.fds-uns-tree-picker__popover', '.fds-dropdown-menu'];
    const EVENTS: Array<keyof DocumentEventMap> = ['pointerdown', 'mousedown'];
    const guard = (e: Event) => {
      const path = (e as { composedPath?: () => EventTarget[] }).composedPath?.() ?? [];
      const matched = path.find(
        (n): n is Element => n instanceof Element && SELECTORS.some((sel) => n.matches(sel)),
      );
      if (matched) {
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();
      }
    };
    EVENTS.forEach((ev) => document.addEventListener(ev, guard));
    return () => EVENTS.forEach((ev) => document.removeEventListener(ev, guard));
  }, []);

  // Only one dropdown/select may be open at a time. Each SelectInput here is
  // manually controlled (its own isOpen boolean, toggled by its trigger) with no
  // outside-click close, so without this they stack open. Every trigger routes
  // through toggleDropdown, which closes all the others first — so clicking a
  // second dropdown auto-closes the first. Item selection inside a dropdown does
  // NOT go through here, so multi-select dropdowns still stay open while picking.
  function closeAllDropdowns() {
    setChartPickerOpen(false);
    setSizePickerOpen(false);
    setAdvancedTitleWeightOpen(false);
    setFormChartTypeOpen(false);
    setFormDashStylePickerOpen(false);
    setFormPeriodicityDropdownOpen(false);
    setFormAxisSeriesDropdownOpen(false);
    setFormStackSeriesDropdownOpen(false);
  }
  function toggleDropdown(isOpen: boolean, open: (v: boolean) => void) {
    closeAllDropdowns();
    if (!isOpen) open(true);
  }

  // ── Builders ──────────────────────────────────────────────────────────────

  function buildUiConfig(overrides: {
    charts?: ChartConfig[];
    title?: string;
    description?: string;
    wrapInCard?: boolean;
    stacked?: boolean;
    showLegend?: boolean;
    showDataLabels?: boolean;
    scroll?: boolean;
    yAxisUnit?: string;
    widgetElements?: WidgetElementsConfig;
    advancedSettings?: WidgetAdvancedSettingsConfig;
    widgetSize?: WidgetSizeConfig;
    cardStyle?: {
      wrapInCard: boolean;
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      borderRadius: number;
    };
  }): ColumnChartUIConfig {
    const card = overrides.cardStyle ?? {
      wrapInCard: overrides.wrapInCard ?? wrapInCard,
      backgroundColor: cardBg,
      borderColor: cardBorderColor,
      borderWidth: cardBorderWidth,
      borderRadius: cardBorderRadius,
    };
    return {
      title:       overrides.title       ?? title,
      description: (overrides.description ?? description) || undefined,
      charts:      overrides.charts      ?? chartsList,
      style: {
        card: {
          wrapInCard: card.wrapInCard,
          bg: '',
          backgroundColor: card.backgroundColor,
          borderColor: card.borderColor,
          borderWidth: card.borderWidth,
          borderRadius: card.borderRadius,
        },
        stacked:        overrides.stacked        ?? stacked,
        showLegend:     overrides.showLegend     ?? showLegend,
        showDataLabels: overrides.showDataLabels ?? showDataLabels,
        scroll:         overrides.scroll         ?? scroll,
        yAxisUnit:      overrides.yAxisUnit      ?? yAxisUnit,
        widgetSize:     overrides.widgetSize     ?? {
          preset: sizePreset, width: sizeWidth, height: sizeHeight, locked: sizeLocked,
        },
        widgetElements: overrides.widgetElements ?? {
          hideWidgetElements: hideSettingsIcon || hideExportIcon || hideChartTitle || hideInfoIcon,
          hideSettingsIcon,
          hideExportIcon,
          hideChartTitle,
          hideInfoIcon,
        },
        advancedSettings: overrides.advancedSettings ?? advancedSettings,
      },
    };
  }

  function updateWidgetSize(patch: Partial<WidgetSizeConfig>) {
    const next: WidgetSizeConfig = {
      preset: sizePreset, width: sizeWidth, height: sizeHeight, locked: sizeLocked, ...patch,
    };
    setSizePreset(next.preset);
    setSizeWidth(next.width);
    setSizeHeight(next.height);
    setSizeLocked(next.locked ?? false);
    emit({ widgetSize: next });
  }

  function updateCardStyle(patch: Partial<{
    wrapInCard: boolean; backgroundColor: string; borderColor: string; borderWidth: number; borderRadius: number;
  }>) {
    const next = {
      wrapInCard, backgroundColor: cardBg, borderColor: cardBorderColor,
      borderWidth: cardBorderWidth, borderRadius: cardBorderRadius, ...patch,
    };
    setWrapInCard(next.wrapInCard);
    setCardBg(next.backgroundColor);
    setCardBorderColor(next.borderColor);
    setCardBorderWidth(next.borderWidth);
    setCardBorderRadius(next.borderRadius);
    emit({ cardStyle: next });
  }

  function updateWidgetElements(patch: Partial<WidgetElementsConfig>) {
    const next = {
      hideWidgetElements: widgetElementsEnabled,
      hideSettingsIcon,
      hideExportIcon,
      hideChartTitle,
      hideInfoIcon,
      ...patch,
    };
    const nextHideWidgetElements =
      next.hideWidgetElements ||
      next.hideSettingsIcon ||
      next.hideExportIcon ||
      next.hideChartTitle ||
      next.hideInfoIcon;
    if ('hideSettingsIcon' in patch) setHideSettingsIcon(next.hideSettingsIcon);
    if ('hideExportIcon' in patch) setHideExportIcon(next.hideExportIcon);
    if ('hideChartTitle' in patch) setHideChartTitle(next.hideChartTitle);
    if ('hideInfoIcon' in patch) setHideInfoIcon(next.hideInfoIcon);
    setWidgetElementsEnabled(nextHideWidgetElements);
    emit({ widgetElements: {
      hideWidgetElements: nextHideWidgetElements,
      hideSettingsIcon: next.hideSettingsIcon,
      hideExportIcon: next.hideExportIcon,
      hideChartTitle: next.hideChartTitle,
      hideInfoIcon: next.hideInfoIcon,
    }});
  }

  function updateAdvancedSettings(patch: Partial<WidgetAdvancedSettingsConfig>) {
    const next = {
      ...advancedSettings,
      ...patch,
    };
    setAdvancedSettings(next);
    emit({ advancedSettings: next });
  }

  // Signature of the last envelope handed to onChange. Lets us drop redundant
  // emits (e.g. a child SDK component re-emitting an identical config on mount,
  // or a UI-only interaction that produced no real change) so the host never
  // re-resolves data for a no-op. Identical JSON ⇒ identical envelope ⇒ safe.
  const lastEmittedSigRef = useRef<string>('');

  function emit(
    uiOverrides: Parameters<typeof buildUiConfig>[0] = {},
    timeOverride?: { timeConfig?: TimeConfig; timeTabConfig?: Record<string, unknown> },
  ) {
    const uiConfig = buildUiConfig(uiOverrides);
    const tc  = timeOverride?.timeConfig    ?? currentTimeConfig;
    const ttc = timeOverride?.timeTabConfig ?? currentTimeTabConfig;
    const envelope = buildEnvelope(config, uiConfig, tc, ttc);
    const sig = JSON.stringify(envelope);
    if (sig === lastEmittedSigRef.current) return;
    lastEmittedSigRef.current = sig;
    onChange(envelope);
  }

  // ── Section accordion helpers ─────────────────────────────────────────────

  function isSectionOpen(section: string) {
    return expandedSections[section] ?? false;
  }

  function toggleSection(section: string) {
    // Single-open accordion: opening a section collapses every other one; only
    // one can stay open at a time (mirrors the LineChart configurator).
    setExpandedSections((prev) => (prev[section] ? {} : { [section]: true }));
  }

  // ── Single emit funnel ─────────────────────────────────────────────────────
  // The ONLY path that writes upstream. Keeps title/description in sync with the
  // active chart so unrelated style emits stay coherent. Fires even when
  // nextCharts is empty — provided an envelope already exists — so deleting the
  // last chart notifies the parent to clear.
  function commitState(nextCharts: ChartConfig[], opts?: { activeChartId?: string | null }) {
    setChartsList(nextCharts);
    const activeId = opts && 'activeChartId' in opts ? opts.activeChartId : selectedChartId;
    const active = nextCharts.find((c) => c._id === activeId) ?? nextCharts[0] ?? null;
    const t = active?.title ?? '';
    const d = active?.description ?? '';
    setTitle(t);
    setDescription(d);
    if (nextCharts.length > 0 || config) {
      emit({ charts: nextCharts, title: t, description: d });
    }
  }

  // Section/modal mutations on a committed chart route through commitState.
  function updateChartInList(chartId: string, update: Partial<ChartConfig>) {
    const next = chartsList.map((c) => c._id === chartId ? { ...c, ...update } : c);
    commitState(next, { activeChartId: selectedChartId });
  }

  // ── Chart Settings: buffers, modes, validation ─────────────────────────────

  const isEditing = editMode !== 'none';
  const isEmpty   = chartsList.length === 0 && !isEditing;   // no charts yet
  const isView    = chartsList.length > 0  && !isEditing;    // browsing committed
  const activeChart = chartsList.find((c) => c._id === selectedChartId) ?? null;
  // The single object the title/description/type fields read & write.
  const formChart: ChartConfig = isEmpty ? pendingChart
    : isEditing ? (draft ?? pendingChart)
    : (activeChart ?? EMPTY_SECTION_CHART);

  // A chart title must be unique across the widget's charts (case-insensitive,
  // trimmed). Excludes the chart being edited so re-saving it unchanged is fine.
  function isDuplicateTitle(title: string, excludeId?: string): boolean {
    const t = title.trim().toLowerCase();
    if (!t) return false;
    return chartsList.some((c) => c._id !== excludeId && c.title.trim().toLowerCase() === t);
  }

  const canAddEmpty    = pendingChart.title.trim().length > 0;
  // Editing: block empty AND duplicate titles. edit-existing excludes its own id
  // so an unchanged title still saves; edit-new (fresh id, not in the list yet)
  // is checked against every existing chart.
  const draftTitle       = draft?.title.trim() ?? '';
  const draftDuplicate   = isEditing && draftTitle.length > 0
    && isDuplicateTitle(draftTitle, editMode === 'edit-existing' ? draft?._id : undefined);
  const canCommitDraft   = draftTitle.length > 0 && !draftDuplicate;
  // Duplicate is surfaced live (explains why Save is disabled); the "required"
  // (empty) error waits until the field is touched.
  const titleError       = isEditing && (draftDuplicate || (titleTouched && !canCommitDraft));
  const titleErrorText   = draftDuplicate ? 'Chart title must be unique' : 'Chart title is required';

  // Route a field change to the right buffer based on the current mode.
  function patchActive(patch: Partial<ChartConfig>) {
    if (isEditing) {
      setDraft((d) => ({ ...(d ?? makeChart()), ...patch }));
    } else if (isEmpty) {
      setPendingChart((p) => ({ ...p, ...patch }));
    } else {
      // View — edits commit live.
      const next = chartsList.map((c) => c._id === selectedChartId ? { ...c, ...patch } : c);
      commitState(next, { activeChartId: selectedChartId });
    }
  }

  // ── Transitions ─────────────────────────────────────────────────────────────

  // Empty → View: promote pendingChart to the first committed chart.
  function handleEmptyAddChart() {
    if (!canAddEmpty) { setTitleTouched(true); return; }
    const chart = makeChart({
      ...pendingChart,
      title: pendingChart.title.trim(),
      description: pendingChart.title ? (pendingChart.description?.trim() || undefined) : undefined,
    });
    setSelectedChartId(chart._id);
    setPendingChart(makeChart());
    setExpandedSections({});
    setTitleTouched(false);
    commitState([chart], { activeChartId: chart._id });
  }

  // View → edit-new: fresh empty draft.
  function startEditNew() {
    setDraft(makeChart());
    setTitleTouched(false);
    setEditMode('edit-new');
  }

  // View → edit-existing: copy of the active chart (so Cancel discards).
  function startEditExisting() {
    if (!activeChart) return;
    setDraft({ ...activeChart });
    setTitleTouched(false);
    setEditMode('edit-existing');
  }

  // Editing → View: replace (edit-existing) or append (edit-new), then commit.
  function saveDraft() {
    if (!draft || !canCommitDraft) { setTitleTouched(true); return; }
    const saved: ChartConfig = {
      ...draft,
      title: draft.title.trim(),
      description: draft.description?.trim() || undefined,
    };
    const next = editMode === 'edit-existing'
      ? chartsList.map((c) => c._id === saved._id ? saved : c)
      : [...chartsList, saved];
    setEditMode('none');
    setDraft(null);
    setSelectedChartId(saved._id);
    setExpandedSections({});
    setTitleTouched(false);
    commitState(next, { activeChartId: saved._id });
  }

  // Editing → View: drop the draft, no emit.
  function cancelEdit() {
    setEditMode('none');
    setDraft(null);
    setTitleTouched(false);
  }

  // Open the shared delete-confirmation modal for a list item.
  function confirmDelete(title: string, message: string, onConfirm: () => void) {
    setPendingDelete({ title, message, onConfirm });
  }

  // View → View/Empty: remove the active chart, fall back to remaining[0] or Empty.
  function removeActiveChart() {
    if (!activeChart) return;
    const next = chartsList.filter((c) => c._id !== activeChart._id);
    const fallback = next[0] ?? null;
    setSelectedChartId(fallback?._id ?? null);
    setEditMode('none');
    setDraft(null);
    setExpandedSections({});
    setDeleteConfirmOpen(false);
    commitState(next, { activeChartId: fallback?._id ?? null });
  }

  // View → View: switch which committed chart the form points at.
  function selectChart(chartId: string) {
    setSelectedChartId(chartId);
    setChartPickerOpen(false);
    setExpandedSections({});
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────

  // Expected fully-expanded body height per section — used only to clamp the
  // anchor so the side modal stays within the viewport.
  const EST_HEIGHT: Record<ModalSection, number> = {
    series: 560, fixed: 420, plotLine: 620, plotBand: 420, axis: 400, stack: 360,
  };

  // Position the side modal: x flush-right of the config column (with a gutter),
  // y aligned to the clicked accordion's header but clamped into the viewport.
  // Publishes the resolved y as a CSS var so CSS can derive the modal max-height.
  function computeAnchor(e: React.MouseEvent, estHeight = 500) {
    const triggerEl = e.currentTarget as HTMLElement | null;
    const accordionEl = triggerEl?.closest('.fds-pa-item') ?? null;
    const headerEl =
      (accordionEl?.querySelector('.fds-pa-item__header') as HTMLElement | null) ?? triggerEl;
    const anchorRect = headerEl?.getBoundingClientRect();
    const panelRect = configRef.current?.getBoundingClientRect();
    const x = (panelRect?.right ?? 0) + 20;
    const margin = 16;
    const vh = window.innerHeight;
    let y = anchorRect?.top ?? margin;
    if (y + estHeight + margin > vh) {
      y = Math.max(margin, vh - estHeight - margin);
    }
    if (y < margin) y = margin;
    setModalX(x);
    setModalY(y);
    document.documentElement.style.setProperty('--cc-modal-anchor-y', `${y}px`);
  }

  function openAddModal(chartId: string, section: ModalSection, e: React.MouseEvent) {
    e.stopPropagation();
    computeAnchor(e, EST_HEIGHT[section]);
    setModalChartId(chartId);
    setModalSection(section);
    setEditingId(null);
    // Data sources get the next palette color by default; other sections start blank.
    const defaultColor = (section === 'series' || section === 'fixed')
      ? nextSeriesColor(chartsList.find((c) => c._id === chartId))
      : (section === 'plotLine' || section === 'plotBand')
      // Plot lines/bands get a sensible default color so the swatch isn't
      // transparent/empty when the modal opens.
      ? '#F79009'
      : '';
    setFormUnsPath(''); setFormLabel(''); setFormColor(defaultColor); setFormUnit(''); setFormPrecision('');
    setFormChartType('Column'); setFormChartTypeOpen(false);
    setFormAxisName(''); setFormAxisYAxis(0); setFormAxisSeriesIds([]); setFormAxisSeriesDropdownOpen(false);
    setFormStackName(''); setFormStackSeriesIds([]); setFormStackSeriesDropdownOpen(false);
    setFormValue(''); setFormFrom(''); setFormTo(''); setFormWidth(''); setFormPlotYAxis(0);
    setFormDashStyle(''); setFormDashStylePickerOpen(false);
    setFormPeriodicityType('independent'); setFormPeriodicities([]); setFormCurrentPeriodicity(''); setFormPeriodicityDropdownOpen(false);
    setModalOpen(true);
  }

  function openEditModal(
    chartId: string,
    section: ModalSection,
    e: React.MouseEvent,
    item: ColumnChartSeriesConfig | { _id: string; unsPath: string; label: string; color?: string; unit?: string },
  ) {
    e.stopPropagation();
    computeAnchor(e, EST_HEIGHT[section]);
    setModalChartId(chartId);
    setModalSection(section);
    setEditingId(item._id);
    setFormUnsPath(item.unsPath);
    setFormLabel(item.label);
    setFormColor(item.color ?? '');
    setFormUnit((item as ColumnChartSeriesConfig).unit ?? '');
    const p = (item as ColumnChartSeriesConfig).precision;
    setFormPrecision(p !== undefined ? String(p) : '');
    setFormChartType((item as ColumnChartSeriesConfig).chartType ?? 'Column');
    setFormChartTypeOpen(false);
    setModalOpen(true);
  }

  function openEditPlotLineModal(chartId: string, e: React.MouseEvent, item: PlotLineConfig) {
    e.stopPropagation();
    computeAnchor(e, EST_HEIGHT.plotLine);
    setModalChartId(chartId);
    setModalSection('plotLine');
    setEditingId(item._id);
    setFormValue(String(item.value));
    setFormLabel(item.label);
    setFormColor(item.color);
    setFormWidth(item.width !== undefined ? String(item.width) : '');
    setFormPlotYAxis((item.yAxis ?? 0) as 0 | 1);
    setFormDashStyle(item.dashStyle ?? '');
    setFormDashStylePickerOpen(false);
    setFormPeriodicityType(item.periodicityType ?? 'independent');
    setFormPeriodicities(item.periodicities ?? []);
    setFormCurrentPeriodicity('');
    setFormPeriodicityDropdownOpen(false);
    setModalOpen(true);
  }

  function openEditPlotBandModal(chartId: string, e: React.MouseEvent, item: PlotBandConfig) {
    e.stopPropagation();
    computeAnchor(e, EST_HEIGHT.plotBand);
    setModalChartId(chartId);
    setModalSection('plotBand');
    setEditingId(item._id);
    setFormFrom(String(item.from));
    setFormTo(String(item.to));
    setFormLabel(item.label);
    setFormColor(item.color);
    setFormPlotYAxis((item.yAxis ?? 0) as 0 | 1);
    setModalOpen(true);
  }

  function openAddAxisModal(chartId: string, e: React.MouseEvent) {
    openAddModal(chartId, 'axis', e);
    // Adding an axis always means the Right axis (the Left one is the default).
    setFormAxisYAxis(1);
    setFormAxisName('');
    setFormAxisSeriesIds([]);
  }

  function openEditAxisModal(chartId: string, e: React.MouseEvent, item: AxisConfig) {
    e.stopPropagation();
    computeAnchor(e, EST_HEIGHT.axis);
    setModalChartId(chartId);
    setModalSection('axis');
    setEditingId(item._id);
    setFormAxisName(item.name);
    setFormAxisYAxis(item.yAxis);
    setFormAxisSeriesIds([...item.seriesIds]);
    setFormAxisSeriesDropdownOpen(false);
    setModalOpen(true);
  }

  function openEditStackModal(chartId: string, e: React.MouseEvent, stack: StackConfig) {
    e.stopPropagation();
    computeAnchor(e, EST_HEIGHT.stack);
    setModalChartId(chartId);
    setModalSection('stack');
    setEditingId(stack._id);
    setFormStackName(stack.name);
    setFormStackSeriesIds([...stack.seriesIds]);
    setFormStackSeriesDropdownOpen(false);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setModalChartId(null);
    setEditingId(null);
    setFormUnsPath(''); setFormLabel(''); setFormColor(''); setFormUnit(''); setFormPrecision('');
    setFormChartType('Column'); setFormChartTypeOpen(false);
    setFormAxisName(''); setFormAxisYAxis(0); setFormAxisSeriesIds([]); setFormAxisSeriesDropdownOpen(false);
    setFormStackName(''); setFormStackSeriesIds([]); setFormStackSeriesDropdownOpen(false);
    setFormValue(''); setFormFrom(''); setFormTo(''); setFormWidth(''); setFormPlotYAxis(0);
    setFormDashStyle(''); setFormDashStylePickerOpen(false);
    setFormPeriodicityType('independent'); setFormPeriodicities([]); setFormCurrentPeriodicity(''); setFormPeriodicityDropdownOpen(false);
  }

  // A data source's Label must be unique (case-insensitive) among the chart's
  // existing sources — series AND fixedSeries together — excluding the one being
  // edited. Drives the inline error + disables the submit button so the same
  // name can't be added twice.
  const duplicateDataSourceName = (() => {
    if (modalSection !== 'series' && modalSection !== 'fixed') return false;
    const name = formLabel.trim().toLowerCase();
    if (!name) return false;
    const chart = chartsList.find((c) => c._id === modalChartId);
    if (!chart) return false;
    return [...chart.series, ...chart.fixedSeries].some(
      (s) => s._id !== editingId && (s.label ?? '').trim().toLowerCase() === name,
    );
  })();

  function handleModalSubmit() {
    if (!modalChartId) { handleModalClose(); return; }
    const chart = chartsList.find((c) => c._id === modalChartId);
    if (!chart) { handleModalClose(); return; }
    // Guard (button is also disabled): never commit a duplicate-named source.
    if ((modalSection === 'series' || modalSection === 'fixed') && duplicateDataSourceName) return;

    let update: Partial<ChartConfig> = {};

    if (modalSection === 'series') {
      const entry: ColumnChartSeriesConfig = {
        _id: editingId ?? `series_${Date.now()}`,
        unsPath: formUnsPath,
        label: formLabel,
        color: formColor || undefined,
        unit: formUnit || undefined,
        precision: formPrecision !== '' ? Number(formPrecision) : undefined,
        chartType: formChartType,
      };
      const nextSeries = editingId
        ? chart.series.map((s) => s._id === editingId ? entry : s)
        : [...chart.series, entry];
      // Re-sync axes: a new series auto-joins the Left axis (not in the Right
      // set); editing preserves the existing membership. Restores series.yAxis.
      const synced = syncAxes({ ...chart, series: nextSeries }, rightIdsOf(chart));
      update = { series: synced.series, fixedSeries: synced.fixedSeries, axes: synced.axes };
    } else if (modalSection === 'plotLine') {
      const rawValue = formValue.trim();
      const entry: PlotLineConfig = {
        _id: editingId ?? `pl_${Date.now()}`,
        value: VARIABLE_REGEX.test(rawValue) ? rawValue : (parseFloat(rawValue) || 0),
        label: formLabel,
        color: formColor,
        ...(formWidth ? { width: parseFloat(formWidth) } : {}),
        ...(formDashStyle ? { dashStyle: formDashStyle as PlotLineConfig['dashStyle'] } : {}),
        // Only persist an axis choice when the chart actually has a Right axis.
        ...((chart.axes ?? []).some((a) => a.yAxis === 1) ? { yAxis: formPlotYAxis } : {}),
        periodicityType: formPeriodicityType,
        ...(formPeriodicityType === 'dependent' && formPeriodicities.length > 0 ? { periodicities: formPeriodicities } : {}),
      };
      update = {
        plotLines: editingId
          ? chart.plotLines.map((p) => p._id === editingId ? entry : p)
          : [...chart.plotLines, entry],
      };
    } else if (modalSection === 'plotBand') {
      const rawFrom = formFrom.trim();
      const rawTo   = formTo.trim();
      const entry: PlotBandConfig = {
        _id: editingId ?? `pb_${Date.now()}`,
        from: VARIABLE_REGEX.test(rawFrom) ? rawFrom : (parseFloat(rawFrom) || 0),
        to:   VARIABLE_REGEX.test(rawTo)   ? rawTo   : (parseFloat(rawTo)   || 0),
        label: formLabel,
        color: formColor,
        // Only persist an axis choice when the chart actually has a Right axis.
        ...((chart.axes ?? []).some((a) => a.yAxis === 1) ? { yAxis: formPlotYAxis } : {}),
      };
      update = {
        plotBands: editingId
          ? chart.plotBands.map((p) => p._id === editingId ? entry : p)
          : [...chart.plotBands, entry],
      };
    } else if (modalSection === 'stack') {
      const entry: StackConfig = {
        _id: editingId ?? `stack_${Date.now()}`,
        name: formStackName,
        seriesIds: formStackSeriesIds,
      };
      update = {
        stacks: editingId
          ? chart.stacks.map((s) => s._id === editingId ? entry : s)
          : [...chart.stacks, entry],
      };
    } else if (modalSection === 'axis') {
      if (formAxisYAxis === 0) {
        // Editing the default Left axis — rename only; membership unchanged.
        update = {
          axes: (chart.axes ?? []).map((axis) => axis.yAxis === 0
            ? { ...axis, name: formAxisName }
            : axis),
        };
      } else {
        // Add/Edit the Right axis — its selected series move to the right; every
        // other series stays on the Left. Empty Right axis is dropped.
        const synced = syncAxes(chart, formAxisSeriesIds, { rightName: formAxisName });
        update = { axes: synced.axes, series: synced.series, fixedSeries: synced.fixedSeries };
      }
    } else {
      const entry: FixedSeriesConfig = {
        _id: editingId ?? `fixed_${Date.now()}`,
        unsPath: formUnsPath,
        label: formLabel,
        color: formColor || undefined,
        chartType: formChartType,
      };
      const nextFixed = editingId
        ? chart.fixedSeries.map((s) => s._id === editingId ? entry : s)
        : [...chart.fixedSeries, entry];
      const synced = syncAxes({ ...chart, fixedSeries: nextFixed }, rightIdsOf(chart));
      update = { series: synced.series, fixedSeries: synced.fixedSeries, axes: synced.axes };
    }

    updateChartInList(modalChartId, update);
    handleModalClose();
  }

  // ── Time ──────────────────────────────────────────────────────────────────

  function handleTimeChange(ttcRawInput: TimeTabUIConfig) {
    // Backfill the Fixed picker's cycle-time defaults (00:00 / Monday / 1st)
    // before mapping, so blanks resolve to a sensible start-of-period window.
    const ttc    = withCycleDefaults(ttcRawInput as unknown as Record<string, unknown>) as unknown as TimeTabUIConfig;
    const ttcRaw = ttc as unknown as Record<string, unknown>;
    // Enforce shift rules (unique+mandatory names, no empty windows, distinct
    // colours) the SDK panel doesn't. Mutates ttc's shift arrays in place so the
    // mapped timeConfig below and the persisted ttcRaw both see the sanitized
    // shifts. Scopes: local picker → top-level shifts, fixed → fixed.shifts.
    let shiftsChanged = false;
    const sanitizeScope = (scope: Record<string, unknown> | undefined) => {
      if (scope && Array.isArray(scope.shifts) && scope.shifts.length > 0) {
        const cleaned = sanitizeShifts(scope.shifts as RawShift[]);
        if (JSON.stringify(cleaned) !== JSON.stringify(scope.shifts)) {
          scope.shifts = cleaned;
          shiftsChanged = true;
        }
      }
    };
    sanitizeScope(ttcRaw);
    sanitizeScope(ttcRaw.fixed as Record<string, unknown> | undefined);
    const tc     = mapTimeTabToTimeConfig(ttc, globalTimepickers);
    // A timezone change is the one edit the SDK dropdown won't reflect on its own
    // — force a re-seed + remount below so the new zone actually sticks.
    const tzChanged = tc.timezone !== currentTimeConfig?.timezone;
    // When the user links time to something OTHER than a Global Time Picker
    // (local / fixed), drop the now-stale `global` scope from the raw TimeTab
    // state before it's persisted. The design-sdk TimeTab leaves the previous
    // `global` object in place when you switch away, and the Lens host keys off
    // that `global` (globalTimepickerId) to keep the widget subscribed to the
    // GTP — so a leftover key means the widget keeps listening to the GTP even
    // after switching to Local. Removing it makes the persisted widget object
    // reflect the actual link type.
    const rawPicker = (ttcRaw.linkTimeWith ?? ttcRaw.timeType ?? 'local') as string;
    if (rawPicker !== 'global') {
      delete ttcRaw.global;
      delete ttcRaw.globalTimepickerId;
      delete ttcRaw.globalTimepickerName;
    }
    // TimeTabConfiguration fires onChange on mount (it normalizes + echoes its
    // value). That happens every time the user merely switches INTO the Time
    // tab — nothing actually changed. Drop the echo so we don't re-resolve data
    // or churn state on a basic tab switch.
    const isEcho =
      JSON.stringify(tc)     === JSON.stringify(currentTimeConfig) &&
      JSON.stringify(ttcRaw) === JSON.stringify(currentTimeTabConfig);
    if (isEcho) return;
    setCurrentTimeConfig(tc);
    setCurrentTimeTabConfig(ttcRaw);
    emit({}, { timeConfig: tc, timeTabConfig: ttcRaw });
    // When we changed the shifts (dropped an invalid one / re-coloured), re-seed
    // the TimeTab so its shift list reflects the sanitized data. Safe here: the
    // SDK closes the Add/Edit Shift panel on save, so no popover is open to be
    // disrupted, and this only fires on genuine shift changes — never on the
    // periodicity/duration edits the reseed guard protects.
    if (shiftsChanged || tzChanged) setTimeTabSeed(ttcRaw);
    // Timezone: the SDK keeps the old value in its internal state, so re-seed
    // (above) AND remount (key bump) with the new value so the dropdown updates.
    if (tzChanged) setTimeTabRemountKey((k) => k + 1);
  }

  // ── Selected chart ────────────────────────────────────────────────────────

  const selectedChartIndex = chartsList.findIndex((c) => c._id === selectedChartId);
  // Downstream sections always render (so the structure is visible) but read
  // from a safe fallback and are disabled until chart settings are finished.
  const sectionChart = activeChart ?? EMPTY_SECTION_CHART;
  const sectionsDisabled = isEmpty || isEditing;
  // Sections reference this; it's the safe fallback so they never null-crash.
  const selectedChart = sectionChart;

  // Charts + their data sources, in the shape TimeTabConfiguration needs to
  // render the comparison "Advance Settings" per-source indicator rows (chart
  // picker + one row per source). Only time series are listed (fixed/scalar
  // series have no comparison overlay). Memoised so the per-source UI's selected
  // chart doesn't reset every keystroke.
  const gtpCharts = useMemo<NonNullable<TimeTabConfigurationProps['charts']>>(
    () => chartsList.map((c, ci) => ({
      id: c._id,
      name: c.title || `Chart ${ci + 1}`,
      sources: c.series.map((s, si) => ({ id: s._id, name: s.label || `Series ${si + 1}` })),
    })),
    [chartsList],
  );

  // Memoised so unrelated re-renders keep the seed's object identity stable —
  // TimeTabConfiguration rehydrates (closing any open side popup, e.g. Edit
  // Duration) whenever its `value` identity changes.
  const timeTabSeedValue = useMemo(
    () => withCycleDefaults(timeTabSeed) as Partial<TimeTabUIConfig> | undefined,
    [timeTabSeed],
  );

  // When per-source indicators (Advance Settings) are on, the chart-wide
  // "General Behaviour of Deviation Indicator" cards above are redundant — flag
  // it so the CSS can disable them.
  const ttcFlags = currentTimeTabConfig as Partial<TimeTabUIConfig> | undefined;
  const ttcPicker = (ttcFlags?.linkTimeWith ?? ttcFlags?.timeType ?? 'local') as string;
  const perSourceActive = Boolean(
    ttcPicker === 'fixed' ? ttcFlags?.fixed?.allowPerSourceIndicator : ttcFlags?.allowPerSourceIndicator,
  );

  // Axis selector for the Plot Line / Plot Band modals — only offered when the
  // chart being edited actually has a Right axis; otherwise everything is on the
  // single Left axis and there's nothing to choose.
  const modalChartForPlot = chartsList.find((c) => c._id === modalChartId);
  const plotRightAxisExists = (modalChartForPlot?.axes ?? []).some((a) => a.yAxis === 1);
  const plotAxisRadio = plotRightAxisExists ? (
    <RadioGroup
      name="plot-axis"
      label="Axis"
      size="Medium"
      value={String(formPlotYAxis)}
      orientation="Horizontal"
      onChange={({ value }: RadioGroupChangeMeta) => setFormPlotYAxis(value === '1' ? 1 : 0)}
    >
      <Radio label="Left"  value="0" />
      <Radio label="Right" value="1" />
    </RadioGroup>
  ) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="cc-config" ref={configRef}>
      <div className="cc-config__header">
        <Tooltip bodyText="Close" placement="Bottom">
          <IconButton
            icon={<ArrowLeft size={20} />}
            size="20"
            aria-label="Close"
            onClick={onBack}
          />
        </Tooltip>
        <span className="BodyLargeSemibold cc-config__header-title">Combined Bar &amp; Line Chart</span>
      </div>

      <Tabs
        variant="Bordered"
        value={activeTab}
        onValueChange={(v) => {
          // Entering the Time tab (re)mounts TimeTabConfiguration, so refresh
          // its rehydration seed to the latest emitted state here — the popup
          // can't be open yet, so this reseed never closes anything.
          if (v === 'time') setTimeTabSeed(currentTimeTabConfig);
          setActiveTab(v as ActiveTab);
        }}
        isFullWidthTabItem
      >
        <TabItem value="data"  label="Data"  />
        <TabItem value="time"  label="Time"  />
        <TabItem value="style" label="Style" />
      </Tabs>

      <div className="cc-config__tab-content">

        {/* ── Data Tab ── */}
        {activeTab === 'data' && (
          <>
            {/* ── Chart Settings: the always-visible entry point ── */}
            <div className="cc-config__chart-settings">
              <div className="cc-config__chart-settings-header">
                <p className="BodySmallSemibold cc-config__chart-settings-heading">Chart Settings</p>
                {/* Header actions vary by mode: edit-existing → 🗑 trash;
                    View → ＋ Add / ✎ Edit; edit-new & Empty → none. */}
                {editMode === 'edit-existing' ? (
                  <IconButton
                    icon={<Trash2 size={14} />}
                    size="16"
                    aria-label="Delete Chart"
                    title="Delete Chart"
                    onClick={() => setDeleteConfirmOpen(true)}
                  />
                ) : isView ? (
                  <div className="cc-config__chart-settings-actions">
                    <IconButton
                      icon={<Plus size={14} />}
                      size="16"
                      aria-label="Add New Chart"
                      title="Add New Chart"
                      onClick={startEditNew}
                    />
                    <IconButton
                      icon={<Edit2 size={14} />}
                      size="16"
                      aria-label="Edit Chart"
                      title="Edit Chart"
                      onClick={startEditExisting}
                    />
                  </div>
                ) : null}
              </div>

              <div className="cc-config__chart-settings-form">
                {/* Title — chart-switcher in View (>1 chart), else a text field
                    (read-only in View, editable in Empty/Editing). */}
                {isView && chartsList.length > 1 ? (
                  <SelectInput
                    label="Chart Title"
                    placeholder="Select a chart…"
                    value={activeChart ? (activeChart.title || `Chart ${selectedChartIndex + 1}`) : ''}
                    isOpen={chartPickerOpen}
                    onClick={() => toggleDropdown(chartPickerOpen, setChartPickerOpen)}
                  >
                    {chartPickerOpen && (
                      <DropdownMenu>
                        <ActionListItemGroup>
                          {chartsList.map((chart, i) => (
                            <ActionListItem
                              key={chart._id}
                              title={chart.title || `Chart ${i + 1}`}
                              selectionType="Single"
                              isSelected={selectedChartId === chart._id}
                              onClick={() => selectChart(chart._id)}
                            />
                          ))}
                        </ActionListItemGroup>
                      </DropdownMenu>
                    )}
                  </SelectInput>
                ) : (
                  <TextInput
                    label="Chart Title"
                    necessityIndicator="required"
                    placeholder="e.g. Energy Overview"
                    value={formChart.title}
                    isReadOnly={isView}
                    validationState={titleError ? 'error' : 'none'}
                    errorText={titleErrorText}
                    onChange={({ value }) => patchActive({ title: value })}
                    onBlur={() => setTitleTouched(true)}
                  />
                )}

                <TextInput
                  label="Description"
                  placeholder="e.g. Hourly power consumption by line"
                  value={formChart.description ?? ''}
                  isReadOnly={isView}
                  onChange={({ value }) => patchActive({ description: value })}
                />

                {/* Footer buttons: Empty → Save (gated); Editing → Cancel +
                    Save. View shows nothing (header owns Add/Edit). */}
                {isEmpty && canAddEmpty && (
                  <div className="cc-config__chart-settings-formactions">
                    <Button variant="Primary" label="Save" onClick={handleEmptyAddChart} />
                  </div>
                )}
                {isEditing && (
                  <div className="cc-config__chart-settings-formactions">
                    <Button variant="Gray" label="Cancel" onClick={cancelEdit} />
                    <Button
                      variant="Primary"
                      label="Save"
                      isDisabled={!canCommitDraft}
                      onClick={saveDraft}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Downstream sections always render so the structure stays visible,
                but are disabled until chart settings are finished. They read from
                sectionChart (a safe fallback when nothing is committed). */}
            <div
              className={sectionsDisabled ? 'cc-config__sections cc-config__sections--disabled' : 'cc-config__sections'}
              aria-disabled={sectionsDisabled}
            >
              <>
                {/* Data Source */}
                <ProductAccordionItem
                  title="Data Source"
                  trailingIcon={selectedChart.series.length > 0
                    ? <Badge color="Neutral" emphasis="Subtle" size="Small" label={String(selectedChart.series.length)} />
                    : undefined}
                  isActive={selectedChart.series.length > 0}
                  isExpanded={isSectionOpen('series')}
                  onToggle={() => toggleSection('series')}
                  headerAction={
                    <Tooltip bodyText="Add data source" placement="Left">
                      <IconButton
                        icon={<Plus size={14} />}
                        size="16"
                        aria-label="Add data source"
                        onClick={(e) => openAddModal(selectedChart._id, 'series', e)}
                      />
                    </Tooltip>
                  }
                >
                    {selectedChart.series.length === 0 && (
                      <p className="cc-config__empty-hint BodySmallRegular">No data sources. Click + to add one.</p>
                    )}
                    {selectedChart.series.map((s, i) => {
                      const chartType = s.chartType === 'Line' ? 'Line' : 'Column';
                      const subtitleParts = [chartType];
                      if (s.unit) subtitleParts.push(s.unit);
                      return (
                      <ListCard
                        key={s._id}
                        title={s.label || `Series ${i + 1}`}
                        subtitle={subtitleParts.join(' • ')}
                        leadingItem={s.color ? <ListCardLeadingItem leading="Color" color={s.color} /> : undefined}
                        onClick={(e) => openEditModal(selectedChart._id, 'series', e, s)}
                        trailingItems={
                          <ListCardTrailingItem trailing="Icon" icon={<IconButton icon={<Trash2 size={13} />} size="16" aria-label="Delete" title="Delete data source" onClick={(e) => { e.stopPropagation(); confirmDelete('Delete Data Source', `Are you sure you want to delete “${s.label || 'this data source'}”? Once deleted, it cannot be restored.`, () => updateChartInList(selectedChart._id, removeSeriesEverywhere(selectedChart, s._id))); }} />} />
                        }
                      />
                      );
                    })}
                </ProductAccordionItem>


                {/* Axis — default Left axis always present; Right axis optional. */}
                <ProductAccordionItem
                  title="Axis"
                  trailingIcon={<Badge color="Neutral" emphasis="Subtle" size="Small" label={String((selectedChart.axes ?? []).length)} />}
                  isActive
                  isExpanded={isSectionOpen('axis')}
                  onToggle={() => toggleSection('axis')}
                  headerAction={
                    <Tooltip bodyText="Add right axis" placement="Left">
                      <IconButton
                        icon={<Plus size={14} />}
                        size="16"
                        aria-label="Add right axis"
                        isDisabled={(selectedChart.axes ?? []).some((a) => a.yAxis === 1)}
                        onClick={(e) => openAddAxisModal(selectedChart._id, e)}
                      />
                    </Tooltip>
                  }
                >
                    <div className="cc-config__modal-hint">
                      <Info size={16} className="cc-config__modal-hint-icon" aria-hidden="true" />
                      <span className="BodySmallRegular">
                        Left axis is used by default. Add a right axis for different values.
                      </span>
                    </div>
                    {(selectedChart.axes ?? []).map((axis) => {
                      const axisSeries = [
                        ...selectedChart.series,
                        ...selectedChart.fixedSeries,
                      ].filter((item) => axis.seriesIds.includes(item._id));
                      const isLeft = axis.yAxis === 0;
                      const axisLabel = isLeft ? 'Left Axis' : 'Right Axis';
                      // Subtitle: "<Left|Right> • <N> Data Source(s)" so the
                      // position is clear even when the axis is renamed.
                      const countLabel = `${axisSeries.length} Data Source${axisSeries.length === 1 ? '' : 's'}`;
                      const subtitle = `${isLeft ? 'Left' : 'Right'} • ${countLabel}`;
                      return (
                        <ListCard
                          key={axis._id}
                          title={axis.name || axisLabel}
                          subtitle={subtitle}
                          onClick={(e) => openEditAxisModal(selectedChart._id, e, axis)}
                          trailingItems={
                            /* The default Left axis can be renamed but not deleted. */
                            !isLeft ? (
                              <ListCardTrailingItem
                                trailing="Icon"
                                icon={(
                                  <IconButton
                                    icon={<Trash2 size={13} />}
                                    size="16"
                                    aria-label="Delete"
                                    title="Delete axis"
                                    onClick={(e) => { e.stopPropagation(); confirmDelete('Delete Axis', 'Are you sure you want to delete this axis? Its data sources will move back to the Left axis.', () => updateChartInList(selectedChart._id, deleteRightAxis(selectedChart))); }}
                                  />
                                )}
                              />
                            ) : undefined
                          }
                        />
                      );
                    })}
                </ProductAccordionItem>

                {/* Plot Lines */}
                <ProductAccordionItem
                  title="Plot Lines"
                  trailingIcon={selectedChart.plotLines.length > 0
                    ? <Badge color="Neutral" emphasis="Subtle" size="Small" label={String(selectedChart.plotLines.length)} />
                    : undefined}
                  isActive={selectedChart.plotLines.length > 0}
                  isExpanded={isSectionOpen('plotLine')}
                  onToggle={() => toggleSection('plotLine')}
                  headerAction={
                    <Tooltip bodyText="Add plot line" placement="Left">
                      <IconButton icon={<Plus size={14} />} size="16" aria-label="Add plot line"
                        onClick={(e) => openAddModal(selectedChart._id, 'plotLine', e)}
                      />
                    </Tooltip>
                  }
                >
                    {selectedChart.plotLines.length === 0 && (
                      <p className="cc-config__empty-hint BodySmallRegular">No plot lines. Click + to add.</p>
                    )}
                    {selectedChart.plotLines.map((p, i) => (
                      <ListCard
                        key={p._id}
                        title={p.label || `Plot Line ${i + 1}`}
                        subtitle={String(p.value)}
                        leadingItem={p.color ? <ListCardLeadingItem leading="Color" color={p.color} /> : undefined}
                        onClick={(e) => openEditPlotLineModal(selectedChart._id, e, p)}
                        trailingItems={
                          <ListCardTrailingItem trailing="Icon" icon={<IconButton icon={<Trash2 size={13} />} size="16" aria-label="Delete" title="Delete plot line" onClick={(e) => { e.stopPropagation(); confirmDelete('Delete Plot Line', `Are you sure you want to delete “${p.label || 'this plot line'}”? Once deleted, it cannot be restored.`, () => updateChartInList(selectedChart._id, { plotLines: selectedChart.plotLines.filter((x) => x._id !== p._id) })); }} />} />
                        }
                      />
                    ))}
                </ProductAccordionItem>

                {/* Plot Bands */}
                <ProductAccordionItem
                  title="Plot Bands"
                  trailingIcon={selectedChart.plotBands.length > 0
                    ? <Badge color="Neutral" emphasis="Subtle" size="Small" label={String(selectedChart.plotBands.length)} />
                    : undefined}
                  isActive={selectedChart.plotBands.length > 0}
                  isExpanded={isSectionOpen('plotBand')}
                  onToggle={() => toggleSection('plotBand')}
                  headerAction={
                    <Tooltip bodyText="Add plot band" placement="Left">
                      <IconButton icon={<Plus size={14} />} size="16" aria-label="Add plot band"
                        onClick={(e) => openAddModal(selectedChart._id, 'plotBand', e)}
                      />
                    </Tooltip>
                  }
                >
                    {selectedChart.plotBands.length === 0 && (
                      <p className="cc-config__empty-hint BodySmallRegular">No plot bands. Click + to add.</p>
                    )}
                    {selectedChart.plotBands.map((p, i) => (
                      <ListCard
                        key={p._id}
                        title={p.label || `Plot Band ${i + 1}`}
                        subtitle={`${p.from} – ${p.to}`}
                        leadingItem={p.color ? <ListCardLeadingItem leading="Color" color={p.color} /> : undefined}
                        onClick={(e) => openEditPlotBandModal(selectedChart._id, e, p)}
                        trailingItems={
                          <ListCardTrailingItem trailing="Icon" icon={<IconButton icon={<Trash2 size={13} />} size="16" aria-label="Delete" title="Delete plot band" onClick={(e) => { e.stopPropagation(); confirmDelete('Delete Plot Band', `Are you sure you want to delete “${p.label || 'this plot band'}”? Once deleted, it cannot be restored.`, () => updateChartInList(selectedChart._id, { plotBands: selectedChart.plotBands.filter((x) => x._id !== p._id) })); }} />} />
                        }
                      />
                    ))}
                </ProductAccordionItem>
              </>
            </div>
          </>
        )}

        {/* ── Time Tab ── */}
        {activeTab === 'time' && (
          <div className={`cc-config__time-tab${perSourceActive ? ' cc-config__time-tab--per-source' : ''}`}>
            <TimeTabConfiguration
              key={timeTabRemountKey}
              onChange={handleTimeChange}
              value={timeTabSeedValue}
              globalTimepickers={globalTimepickers}
              charts={gtpCharts}
            />
          </div>
        )}

        {/* ── Style Tab ── */}
        {activeTab === 'style' && (
          <>
            {/* Wrap Into Card */}
            <div className="cc-config__wrap-card">
              <div className="cc-config__field-row">
                <span className="BodySmallSemibold cc-config__toggle-label">Wrap Into Card</span>
                <Switch
                  accessibilityLabel="Wrap Into Card"
                  isChecked={wrapInCard}
                  onChange={({ isChecked }) => updateCardStyle({ wrapInCard: isChecked })}
                />
              </div>
              {wrapInCard && (
                <div className="cc-config__wrap-card-body">
                  <div>
                    <InputFieldHeader label="Background Color" />
                    <ColorInput value={cardBg} onChange={(v) => updateCardStyle({ backgroundColor: v })} />
                  </div>
                  <div>
                    <InputFieldHeader label="Border Color" />
                    <ColorInput value={cardBorderColor} onChange={(v) => updateCardStyle({ borderColor: v })} />
                  </div>
                  <TextInput
                    label="Border Width"
                    type="number"
                    suffix="px"
                    placeholder="e.g. 1"
                    value={String(cardBorderWidth)}
                    onChange={({ value }) => updateCardStyle({ borderWidth: Number(nonNegIntStr(value)) || 0 })}
                  />
                  <TextInput
                    label="Border Radius"
                    type="number"
                    suffix="px"
                    placeholder="e.g. 4"
                    value={String(cardBorderRadius)}
                    onChange={({ value }) => updateCardStyle({ borderRadius: Number(nonNegIntStr(value)) || 0 })}
                  />
                </div>
              )}
            </div>

            {/* Chart scroll — horizontal scroll for long ranges / many bars */}
            <div className="cc-config__wrap-card">
              <div className="cc-config__field-row">
                <span className="BodySmallSemibold cc-config__toggle-label">Scroll</span>
                <Switch
                  accessibilityLabel="Scroll"
                  isChecked={scroll}
                  onChange={({ isChecked }) => { setScroll(isChecked); emit({ scroll: isChecked }); }}
                />
              </div>
            </div>

            <div className="cc-config__widget-elements-section">
              <div className="cc-config__field-row">
                <span className="SmallSemibold cc-config__field-label">Hide Widget Element</span>
              </div>
              <CheckboxGroup
                label=""
                orientation="Vertical"
                className="cc-config__widget-elements-group"
              >
                <Checkbox
                  label="Setting Icon"
                  size="Medium"
                  isChecked={hideSettingsIcon}
                  onChange={() => updateWidgetElements({ hideSettingsIcon: !hideSettingsIcon })}
                />
                <Checkbox
                  label="Export Icon"
                  size="Medium"
                  isChecked={hideExportIcon}
                  onChange={() => updateWidgetElements({ hideExportIcon: !hideExportIcon })}
                />
                <Checkbox
                  label="Info Icon"
                  size="Medium"
                  isChecked={hideInfoIcon}
                  onChange={() => updateWidgetElements({ hideInfoIcon: !hideInfoIcon })}
                />
                {/* With multiple charts the title row IS the chart switcher —
                    hiding it would remove the only way to move between charts, so
                    the option is disabled (and unchecked). A tooltip explains
                    why. The tooltip wraps a hoverable <div> (a disabled checkbox
                    doesn't reliably fire hover on its own), and `placement="Top"`
                    keeps it inside the config panel column rather than floating
                    over the canvas. */}
                {chartsList.length > 1 ? (
                  <Tooltip
                    bodyText="Can't hide the chart title while more than one chart is added — the title row is the chart switcher used to move between charts."
                    placement="Top"
                  >
                    <div className="cc-config__disabled-check">
                      <Checkbox
                        label="Chart Title"
                        size="Medium"
                        isDisabled
                        isChecked={false}
                        onChange={() => { /* disabled — no-op */ }}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <Checkbox
                    label="Chart Title"
                    size="Medium"
                    isChecked={hideChartTitle}
                    onChange={() => updateWidgetElements({ hideChartTitle: !hideChartTitle })}
                  />
                )}
              </CheckboxGroup>
            </div>

            <div className="cc-config__advanced-section">
              <div className="cc-config__field-row">
                <span className="BodySmallSemibold cc-config__toggle-label">Advanced Settings</span>
                <Switch
                  accessibilityLabel="Advanced Settings"
                  isChecked={advancedSettings.enabled}
                  onChange={({ isChecked }) => updateAdvancedSettings({ enabled: isChecked })}
                />
              </div>

              {advancedSettings.enabled && (
                <div className="cc-config__advanced-body">
                  <p className="LabelMediumDefault cc-config__advanced-heading">Chart Title</p>
                  <TextInput
                    label="Title Font Size"
                    type="number"
                    placeholder="e.g. 20"
                    value={titleFontSizeInput}
                    onChange={({ value }) => {
                      // Digits only — strips a leading "-" (no negatives) and any
                      // stray non-numeric characters. Keeps the raw string so the
                      // field can still be cleared / hold a partial value; only a
                      // valid positive number is committed.
                      const clean = value.replace(/[^\d]/g, '');
                      setTitleFontSizeInput(clean);
                      const parsed = Number(clean);
                      if (clean !== '' && Number.isFinite(parsed) && parsed > 0) {
                        updateAdvancedSettings({ titleFontSize: Math.round(parsed) });
                      }
                    }}
                    onBlur={({ value }) => {
                      // On blur, an empty / invalid field snaps back to the last
                      // committed size so it never lingers blank.
                      const parsed = Number(value);
                      if (value.trim() === '' || !Number.isFinite(parsed) || parsed <= 0) {
                        setTitleFontSizeInput(String(advancedSettings.titleFontSize));
                      }
                    }}
                  />
                  <div>
                    <InputFieldHeader label="Title Font Color" />
                    <ColorInput
                      value={advancedSettings.titleFontColor}
                      onChange={(value) => updateAdvancedSettings({ titleFontColor: value })}
                    />
                  </div>
                  <SelectInput
                    label="Title Font Weight"
                    placeholder="Select weight"
                    value={advancedSettings.titleFontWeight}
                    isOpen={advancedTitleWeightOpen}
                    onClick={() => toggleDropdown(advancedTitleWeightOpen, setAdvancedTitleWeightOpen)}
                  >
                    {advancedTitleWeightOpen && (
                      <DropdownMenu>
                        <ActionListItemGroup>
                          {(['Regular', 'Medium', 'Semi-Bold', 'Bold'] as const).map((weight) => (
                            <ActionListItem
                              key={weight}
                              title={weight}
                              selectionType="Single"
                              isSelected={advancedSettings.titleFontWeight === weight}
                              onClick={() => {
                                updateAdvancedSettings({ titleFontWeight: weight });
                                setAdvancedTitleWeightOpen(false);
                              }}
                            />
                          ))}
                        </ActionListItemGroup>
                      </DropdownMenu>
                    )}
                  </SelectInput>

                  <Divider variant="Subtle" />

                  <p className="LabelMediumDefault cc-config__advanced-heading">X Axis</p>
                  <div>
                    <InputFieldHeader label="Axis Text Color" />
                    <ColorInput
                      value={advancedSettings.xAxisTextColor}
                      onChange={(value) => updateAdvancedSettings({ xAxisTextColor: value })}
                    />
                  </div>
                  <div>
                    <InputFieldHeader label="Axis Line Color" />
                    <ColorInput
                      value={advancedSettings.xAxisLineColor}
                      onChange={(value) => updateAdvancedSettings({ xAxisLineColor: value })}
                    />
                  </div>

                  <Divider variant="Subtle" />

                  <p className="LabelMediumDefault cc-config__advanced-heading">Y Axis</p>
                  <div>
                    <InputFieldHeader label="Axis Text Color" />
                    <ColorInput
                      value={advancedSettings.yAxisTextColor}
                      onChange={(value) => updateAdvancedSettings({ yAxisTextColor: value })}
                    />
                  </div>

                  <Divider variant="Subtle" />

                  <p className="LabelMediumDefault cc-config__advanced-heading">Others</p>
                  <div>
                    <InputFieldHeader label="Grid Line Color" />
                    <ColorInput
                      value={advancedSettings.gridLineColor}
                      onChange={(value) => updateAdvancedSettings({ gridLineColor: value })}
                    />
                  </div>
                  <div>
                    <InputFieldHeader label="Legend Text Color" />
                    <ColorInput
                      value={advancedSettings.legendTextColor}
                      onChange={(value) => updateAdvancedSettings({ legendTextColor: value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {/* ── Delete-chart confirmation ── */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        size="Small"
        header={
          <ModalHeader
            title="Delete Chart"
            leadingItem={<ModalLeadingItem leading="Icon" className="cc-delete-leading" icon={<Trash2 size={16} />} />}
            onClose={() => setDeleteConfirmOpen(false)}
          />
        }
        footer={
          <ModalFooter
            stacking="Horizontal"
            secondaryAction={<Button variant="Gray" label="Cancel" onClick={() => setDeleteConfirmOpen(false)} />}
            primaryAction={<Button variant="Primary" color="Negative" label="Delete" onClick={removeActiveChart} />}
          />
        }
      >
        <ModalBody>
          <p className="BodyMediumRegular">
            Are you sure you want to delete this chart? Once deleted, this chart cannot be restored.
          </p>
        </ModalBody>
      </Modal>

      {/* ── Shared list-item delete confirmation (data source / axis / plot line / plot band) ── */}
      <Modal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        size="Small"
        header={
          <ModalHeader
            title={pendingDelete?.title ?? 'Delete'}
            leadingItem={<ModalLeadingItem leading="Icon" className="cc-delete-leading" icon={<Trash2 size={16} />} />}
            onClose={() => setPendingDelete(null)}
          />
        }
        footer={
          <ModalFooter
            stacking="Horizontal"
            secondaryAction={<Button variant="Gray" label="Cancel" onClick={() => setPendingDelete(null)} />}
            primaryAction={<Button variant="Primary" color="Negative" label="Delete" onClick={() => { pendingDelete?.onConfirm(); setPendingDelete(null); }} />}
          />
        }
      >
        <ModalBody>
          <p className="BodyMediumRegular">{pendingDelete?.message}</p>
        </ModalBody>
      </Modal>

      {/* ── Shared Add / Edit Modal ── */}
      <Modal
        {...({ transparent: true } as any)}
        isOpen={modalOpen}
        positionX={modalX}
        positionY={modalY}
        className="cc-series-modal"
        onClose={handleModalClose}
        header={
          <ModalHeader
            title={
              modalSection === 'plotLine'  ? (editingId ? 'Edit Plot Line'    : 'Add Plot Line')
            : modalSection === 'plotBand'  ? (editingId ? 'Edit Plot Band'    : 'Add Plot Band')
            : modalSection === 'axis'      ? (editingId ? (formAxisYAxis === 0 ? 'Edit Left Axis' : 'Edit Right Axis') : 'Add Right Axis')
            : modalSection === 'fixed'     ? (editingId ? 'Edit Fixed Series' : 'Add Fixed Series')
            : modalSection === 'stack'     ? (editingId ? 'Edit Stack'        : 'Add Stack')
            :                               (editingId ? 'Edit Data Source'   : 'Add Data Source')
            }
            onClose={handleModalClose}
          />
        }
        footer={
          <ModalFooter
            stacking="Vertical"
            primaryAction={
            <Button
              variant="Primary"
              label={
                editingId ? 'Save Changes'
                : modalSection === 'plotBand' ? 'Add Plot Band'
                : modalSection === 'plotLine' ? 'Add Plot Line'
                : modalSection === 'axis'     ? 'Add Right Axis'
                : modalSection === 'stack'    ? 'Add Stack'
                : 'Add'
              }
              isFullWidth
              isDisabled={
                (modalSection === 'series' || modalSection === 'fixed')
                  ? !formLabel.trim() || !formUnsPath.trim() || !formColor.trim() || duplicateDataSourceName
                  : modalSection === 'plotBand'
                  ? !formLabel.trim() || !formColor.trim() || !formFrom.trim() || !formTo.trim()
                  : modalSection === 'axis'
                  // Label is compulsory for both axes; the right axis also needs ≥1 series.
                  ? (!formAxisName.trim() || (formAxisYAxis === 1 && formAxisSeriesIds.length === 0))
                  : modalSection === 'stack'
                  ? !formStackName.trim() || formStackSeriesIds.length === 0
                  : modalSection === 'plotLine'
                  // Label + width are required; a Dependent line also needs at
                  // least one periodicity (else it can't be scoped and would
                  // render at every periodicity).
                  ? !formLabel.trim() || !formWidth.trim()
                    || (formPeriodicityType === 'dependent' && formPeriodicities.length === 0)
                  : false
              }
              onClick={handleModalSubmit}
            />
            }
          />
        }
      >
        <ModalBody>
          <div className="cc-series-modal__body">
            {(modalSection === 'series' || modalSection === 'fixed') && (
              <>
                <TextInput
                  label="Label"
                  necessityIndicator="required"
                  placeholder={modalSection === 'fixed' ? 'e.g. Target' : 'e.g. Power Consumption'}
                  value={formLabel}
                  onChange={({ value }) => setFormLabel(value)}
                  validationState={duplicateDataSourceName ? 'error' : 'none'}
                  errorText={duplicateDataSourceName ? `A data source named "${formLabel.trim()}" already exists in this chart.` : undefined}
                />
                {modalSection === 'series' && (
                  <SelectInput
                    label="Chart Type"
                    placeholder="Select chart type…"
                    value={formChartType}
                    isOpen={formChartTypeOpen}
                    onClick={() => toggleDropdown(formChartTypeOpen, setFormChartTypeOpen)}
                  >
                    {formChartTypeOpen && (
                      <DropdownMenu>
                        <ActionListItemGroup>
                          <ActionListItem
                            title="Column"
                            selectionType="Single"
                            isSelected={formChartType === 'Column'}
                            onClick={() => { setFormChartType('Column'); setFormChartTypeOpen(false); }}
                          />
                          <ActionListItem
                            title="Line"
                            selectionType="Single"
                            isSelected={formChartType === 'Line'}
                            onClick={() => { setFormChartType('Line'); setFormChartTypeOpen(false); }}
                          />
                        </ActionListItemGroup>
                      </DropdownMenu>
                    )}
                  </SelectInput>
                )}
                <div>
                  <InputFieldHeader label="Color" necessityIndicator="required" />
                  <ColorInput value={formColor} onChange={(v) => setFormColor(v)} />
                </div>
                <UNSTreePicker
                  label="UNS Path"
                  necessityIndicator="required"
                  placeholder="e.g. plant/line1/power — or type / to browse"
                  value={formUnsPath}
                  workspaces={unsWorkspaces}
                  isLoadingWorkspaces={isLoadingWorkspaces}
                  loadChildren={loadUnsChildren}
                  searchNodes={searchUnsNodes}
                  onChange={(value: string) => setFormUnsPath(value)}
                  onOpen={closeAllDropdowns}
                />
                {modalSection === 'series' && (
                  <div className="cc-series-modal__two-col">
                    <TextInput label="Unit" placeholder="e.g. kWh" value={formUnit} onChange={({ value }) => setFormUnit(value)} />
                    <TextInput label="Precision" type="number" placeholder="e.g. 2" value={formPrecision} onChange={({ value }) => setFormPrecision(nonNegIntStr(value))} />
                  </div>
                )}
              </>
            )}
            {modalSection === 'plotLine' && (
              <>
                {/* 1. Identity */}
                <TextInput label="Label" necessityIndicator="required" isRequired placeholder="e.g. Target" value={formLabel} onChange={({ value }) => setFormLabel(value)} />
                {/* 2. Data */}
                {/* design-sdk 0.7.17 `allowFreeValue`: type a number directly, or
                    type a leading `/` to flip into the UNS picker — one field
                    handles both, replacing the Static/UNS toggle this used before
                    the prop existed. The save handler coerces via VARIABLE_REGEX. */}
                <UNSTreePicker
                  label="Value"
                  placeholder="Type a number or / to bind"
                  value={formValue}
                  allowFreeValue
                  workspaces={unsWorkspaces}
                  isLoadingWorkspaces={isLoadingWorkspaces}
                  loadChildren={loadUnsChildren}
                  searchNodes={searchUnsNodes}
                  onChange={(value: string) => setFormValue(value)}
                  onOpen={closeAllDropdowns}
                />
                {/* 3. Color */}
                <div>
                  <InputFieldHeader label="Color" necessityIndicator="required" />
                  <ColorInput value={formColor} onChange={(v) => setFormColor(v)} />
                </div>
                {/* 4. Line style */}
                <div className="cc-series-modal__two-col">
                  <TextInput label="Width" necessityIndicator="required" isRequired type="number" placeholder="e.g. 2" value={formWidth} onChange={({ value }) => setFormWidth(nonNegDecimalStr(value))} />
                  <SelectInput label="Dash style" placeholder="Solid" value={formDashStyle || 'Solid'} isOpen={formDashStylePickerOpen} onClick={() => toggleDropdown(formDashStylePickerOpen, setFormDashStylePickerOpen)}>
                    {formDashStylePickerOpen && (
                      <DropdownMenu>
                        <ActionListItemGroup>
                          {(['Solid', 'Dash', 'Dot', 'DashDot', 'LongDash', 'ShortDash'] as const).map((ds) => (
                            <ActionListItem key={ds} title={ds} selectionType="Single"
                              isSelected={formDashStyle === ds || (!formDashStyle && ds === 'Solid')}
                              onClick={() => { setFormDashStyle(ds); setFormDashStylePickerOpen(false); }}
                            />
                          ))}
                        </ActionListItemGroup>
                      </DropdownMenu>
                    )}
                  </SelectInput>
                </div>
                {/* 5. Axis (only when a Right axis exists) */}
                {plotAxisRadio}
                {/* 6. Periodicity behavior */}
                <RadioGroup
                  name="periodicity-type"
                  label="Periodicity"
                  size="Medium"
                  value={formPeriodicityType}
                  orientation="Horizontal"
                  onChange={({ value }: RadioGroupChangeMeta) => {
                    setFormPeriodicityType(value as 'independent' | 'dependent');
                    if (value === 'independent') { setFormPeriodicities([]); setFormCurrentPeriodicity(''); setFormPeriodicityDropdownOpen(false); }
                  }}
                >
                  <Radio label="Independent" value="independent" />
                  <Radio label="Dependent"   value="dependent" />
                </RadioGroup>
                {formPeriodicityType === 'dependent' && (
                  <>
                    <InputFieldHeader label="Periodicities" necessityIndicator="required" />
                    <div className="cc-periodicity-row">
                      <div className="cc-periodicity-row__select">
                        <SelectInput
                          label="Add periodicity"
                          placeholder="e.g. Hourly"
                          value={formCurrentPeriodicity ? formCurrentPeriodicity.charAt(0).toUpperCase() + formCurrentPeriodicity.slice(1) : ''}
                          isOpen={formPeriodicityDropdownOpen}
                          onClick={() => toggleDropdown(formPeriodicityDropdownOpen, setFormPeriodicityDropdownOpen)}
                        >
                          {formPeriodicityDropdownOpen && (
                            <DropdownMenu>
                              <ActionListItemGroup>
                                {(['hourly', 'daily', 'weekly', 'monthly'] as const)
                                  .filter((p) => !formPeriodicities.includes(p))
                                  .map((p) => (
                                    <ActionListItem
                                      key={p}
                                      title={p.charAt(0).toUpperCase() + p.slice(1)}
                                      selectionType="Single"
                                      isSelected={formCurrentPeriodicity === p}
                                      onClick={() => { setFormCurrentPeriodicity(p); setFormPeriodicityDropdownOpen(false); }}
                                    />
                                  ))}
                              </ActionListItemGroup>
                            </DropdownMenu>
                          )}
                        </SelectInput>
                      </div>
                      <Button
                        variant="Secondary"
                        label="Add"
                        isDisabled={!formCurrentPeriodicity}
                        onClick={() => {
                          if (formCurrentPeriodicity) {
                            setFormPeriodicities([...formPeriodicities, formCurrentPeriodicity as PlotLinePeriodicity]);
                            setFormCurrentPeriodicity('');
                          }
                        }}
                      />
                    </div>
                    {formPeriodicities.length > 0 && (
                      <div className="cc-periodicity-tags">
                        {formPeriodicities.map((p) => (
                          <Tag
                            key={p}
                            label={p.charAt(0).toUpperCase() + p.slice(1)}
                            onDismiss={() => setFormPeriodicities(formPeriodicities.filter((x) => x !== p))}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {modalSection === 'plotBand' && (
              <>
                <TextInput label="Name" necessityIndicator="required" isRequired placeholder="e.g. Overload Zone" value={formLabel} onChange={({ value }) => setFormLabel(value)} />
                <div>
                  <InputFieldHeader label="Color" necessityIndicator="required" />
                  <ColorInput value={formColor} onChange={(v) => setFormColor(v)} />
                </div>
                {/* allowFreeValue (design-sdk 0.7.17): type a number or / to
                    bind a UNS topic — one hybrid field per bound, no toggle. */}
                <div className="cc-series-modal__two-col">
                  <UNSTreePicker label="Start value" necessityIndicator="required" isRequired placeholder="Value or / to bind" value={formFrom} allowFreeValue workspaces={unsWorkspaces} isLoadingWorkspaces={isLoadingWorkspaces} loadChildren={loadUnsChildren} searchNodes={searchUnsNodes} onChange={(value: string) => setFormFrom(value)} onOpen={closeAllDropdowns} />
                  <UNSTreePicker label="End value"   necessityIndicator="required" isRequired placeholder="Value or / to bind" value={formTo}   allowFreeValue workspaces={unsWorkspaces} isLoadingWorkspaces={isLoadingWorkspaces} loadChildren={loadUnsChildren} searchNodes={searchUnsNodes} onChange={(value: string) => setFormTo(value)} onOpen={closeAllDropdowns} />
                </div>
                {/* Axis (only when a Right axis exists) */}
                {plotAxisRadio}
              </>
            )}
            {modalSection === 'axis' && (() => {
              const modalChart = chartsList.find((c) => c._id === modalChartId);
              const axisItems = modalChart ? [
                ...modalChart.series.map((s, i) => ({ _id: s._id, label: s.label || `Series ${i + 1}` })),
                ...modalChart.fixedSeries.map((s, i) => ({ _id: s._id, label: s.label || `Fixed ${i + 1}` })),
              ] : [];
              return (
                <>
                  <TextInput
                    label="Label"
                    necessityIndicator="required"
                    isRequired
                    placeholder="e.g. Temperature (°C)"
                    value={formAxisName}
                    onChange={({ value }) => setFormAxisName(value)}
                  />
                  {/* The default Left axis is rename-only. The Right axis picks
                      which data sources move onto it (the rest stay on Left). */}
                  {formAxisYAxis === 1 && (
                    <SelectInput
                      label="Data Sources"
                      isRequired
                      placeholder="Select data sources…"
                      tags={formAxisSeriesIds.map((id) => {
                        const item = axisItems.find((it) => it._id === id);
                        return {
                          label: item?.label ?? id,
                          onDismiss: () => setFormAxisSeriesIds(formAxisSeriesIds.filter((x) => x !== id)),
                        };
                      })}
                      isOpen={formAxisSeriesDropdownOpen}
                      onClick={() => toggleDropdown(formAxisSeriesDropdownOpen, setFormAxisSeriesDropdownOpen)}
                    >
                      {formAxisSeriesDropdownOpen && (
                        <DropdownMenu>
                          <ActionListItemGroup>
                            {axisItems.map((item) => (
                              <ActionListItem
                                key={item._id}
                                title={item.label}
                                selectionType="Multiple"
                                isSelected={formAxisSeriesIds.includes(item._id)}
                                onClick={() => {
                                  const has = formAxisSeriesIds.includes(item._id);
                                  setFormAxisSeriesIds(has
                                    ? formAxisSeriesIds.filter((x) => x !== item._id)
                                    : [...formAxisSeriesIds, item._id]
                                  );
                                }}
                              />
                            ))}
                          </ActionListItemGroup>
                        </DropdownMenu>
                      )}
                    </SelectInput>
                  )}
                </>
              );
            })()}
            {modalSection === 'stack' && (() => {
              const modalChart = chartsList.find((c) => c._id === modalChartId);
              const stackItems = modalChart ? [
                ...modalChart.series.map((s, i) => ({ _id: s._id, label: s.label || `Series ${i + 1}` })),
                ...modalChart.fixedSeries.map((s, i) => ({ _id: s._id, label: s.label || `Fixed ${i + 1}` })),
              ] : [];
              return (
                <>
                  <TextInput
                    label="Stack name"
                    necessityIndicator="required"
                    isRequired
                    placeholder="e.g. Group A"
                    value={formStackName}
                    onChange={({ value }) => setFormStackName(value)}
                  />
                  <SelectInput
                    label="Series"
                    isRequired
                    placeholder="Select series to stack…"
                    tags={formStackSeriesIds.map((id) => {
                      const item = stackItems.find((it) => it._id === id);
                      return {
                        label: item?.label ?? id,
                        onDismiss: () => setFormStackSeriesIds(formStackSeriesIds.filter((x) => x !== id)),
                      };
                    })}
                    isOpen={formStackSeriesDropdownOpen}
                    onClick={() => toggleDropdown(formStackSeriesDropdownOpen, setFormStackSeriesDropdownOpen)}
                  >
                    {formStackSeriesDropdownOpen && (
                      <DropdownMenu>
                        <ActionListItemGroup>
                          {stackItems.map((item) => (
                            <ActionListItem
                              key={item._id}
                              title={item.label}
                              selectionType="Multiple"
                              isSelected={formStackSeriesIds.includes(item._id)}
                              onClick={() => {
                                const has = formStackSeriesIds.includes(item._id);
                                setFormStackSeriesIds(has
                                  ? formStackSeriesIds.filter((x) => x !== item._id)
                                  : [...formStackSeriesIds, item._id]
                                );
                              }}
                            />
                          ))}
                        </ActionListItemGroup>
                      </DropdownMenu>
                    )}
                  </SelectInput>
                </>
              );
            })()}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
