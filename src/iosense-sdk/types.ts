export interface UNSNode {
  id: string;
  type: string;
  name?: string;
  path: string | null;
  parentId: string | null;
}

export interface SeriesSlot {
  from: number;
  to: number;
  label: string;
  value: number | null;
  quality: string;
  isPartial?: boolean;
}

export interface SeriesAggregation {
  operator: string;
  downscale: number;
  resolution: string;
}

export interface SeriesMeta {
  type: string;
  key: string;
  unit: string | null;
  dataPrecision: number | null;
  aggregation: SeriesAggregation;
  devID: string;
  sensor: string;
}

export interface SeriesPayload {
  __type: 'series';
  path: string;
  meta: SeriesMeta;
  range: { from: number; to: number };
  slots: SeriesSlot[];
}

export interface ScalarBinding { key: string; topic: string; }
export interface SeriesBinding  { key: string; topic: string; type: 'series'; }
export type BindingEntry = ScalarBinding | SeriesBinding;

// A resolved binding as the engine (prod Lens Data Engine / dev MiniEngine)
// hands it to the widget. The engine passes the `resolveAndCompute` response
// items through AS-IS:
//   • scalar item → { key, value }
//   • series item → { key, slots, meta, range, path }  (series fields at the
//     top level — NOT wrapped under `value`)
// The optional `value: SeriesPayload` form is kept only for backward-compat
// with any caller that still wraps; readers tolerate both.
export interface DataEntry {
  key: string;
  value?: string | number | null | SeriesPayload;
  // Raw series-item fields (present when value is absent).
  slots?: SeriesSlot[];
  // Comparison-period buckets, returned alongside `slots` by resolveAndCompute
  // when the request carries comparisonMode + comparisonStartTime/EndTime. Same
  // index alignment / bucket count as `slots`. The widget reads these inline
  // (getComparisonSeriesData) for its overlay — no separate comparisonData array.
  comparisonSlots?: SeriesSlot[];
  meta?: SeriesMeta;
  range?: { from: number; to: number };
  path?: string;
  __type?: string;
}

export interface Duration {
  id: string;
  label?: string;
  navigation?: string;            // e.g. 'Previous'
  x?: number;                     // start offset count
  xPeriod: string;                // 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
  xEvent?: string;                // 'Start' | 'End' | 'Now' — boundary the start snaps to
  y?: number;                     // end offset count
  yPeriod?: string;
  yEvent?: string;                // 'Start' | 'End' | 'Now' — boundary the end snaps to
  calendarType?: string;          // e.g. 'today' | 'yesterday' | 'current_month'
  periodicities?: string[];
}

// Raw cycle-time config (matches the platform's GTPCycleTimeConfig). The
// resolver reads these fields directly, mirroring the GlobalTimePicker
// reference: hour:minute = day boundary, dayOfWeek = week boundary (0=Sun),
// date = month boundary day, month = year boundary (month NAME e.g. "January").
export interface CycleTime {
  identifier?: string;            // 'start' | 'end'
  hour?: string | number;
  minute?: string | number;
  dayOfWeek?: number | null;
  date?: string | number;
  month?: string;                 // month name, e.g. "January"
}

export interface TimeConfig {
  timezone: string;
  type: 'local' | 'fixed' | string;
  // Cycle-time boundaries used when resolving Start/End of day/week/month/year.
  cycleTime?: CycleTime;
  // The time-picker mode the user selected in the time tab (TimeTab's
  // `linkTimeWith`). `local` = user-controllable rolling window; `fixed` and
  // `global` = time is controlled externally, so the widget hides its picker.
  pickerType?: 'local' | 'fixed' | 'global';
  startTime: number | null;
  endTime: number | null;
  // The single "set duration" of the Fixed time picker, resolved at runtime
  // via resolveDurationWindow (x/xPeriod/xEvent + y/yPeriod/yEvent + navigation).
  fixedDuration?: Duration;
  defaultDurationId: string;
  // For `global` mode: the durations/defaultDurationId/cycleTime are INHERITED
  // from the linked Global Time Picker (looked up in the configurator's
  // `globalTimepickers` prop) and baked in here so the engine can resolve a
  // fallback window and the widget can display the link. `globalTimepickerId`
  // identifies which GTP the host must subscribe to for the live window.
  globalTimepickerId?: string;
  globalTimepickerName?: string;
  allDurations: Duration[];
  defaultPeriodicity: 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  // When true (set in the time tab's "Disable Periodicities" switch) the widget
  // hides its periodicity dropdown and just uses the default periodicity.
  disablePeriodicities?: boolean;
  // Comparison mode (time tab "Comparison Mode" switch). When on, the widget
  // overlays a comparison period and shows ▲/▼ deviation indicators. The
  // deviationPattern picks polarity (green-up = positive, or red-up = positive).
  comparisonMode?: boolean;
  deviationPattern?: 'green-up-positive' | 'red-up-positive';
  allowPerSourceIndicator?: boolean;
  // Shifts configured in the time tab (or inherited from the linked GTP). When
  // present the date picker shows a "Shift" toggle; the aggregator (default
  // "max") decides how a bucket spanning multiple shifts is rolled up.
  shifts?: Array<{ id: string; name: string; startTime: string; endTime: string; color: string }>;
  shiftAggregator?: string;
  // Per-source deviation polarity overrides (the "Advanced Settings → Allow a
  // different comparison indicator for each data source" feature). Keyed by
  // `${chartId}:${sourceId}`; only honored when allowPerSourceIndicator is on.
  sourceDeviationOverrides?: Record<string, 'green-up-positive' | 'red-up-positive'>;
}

// A resolved time window. In `global` mode the host (Lens / dev harness)
// injects the linked Global Time Picker's CURRENT broadcast window as this
// shape into the engine ctx, and it flows straight into the resolveAndCompute
// payload (startTime/endTime/timeFrame).
export interface TimeWindow {
  startTime: number;
  endTime: number;
  periodicity?: string;
  // Explicit comparison-period window chosen in the date picker's Compare panel
  // (Previous period / Same period last year / Custom). When present the engine
  // uses it verbatim instead of deriving the immediately-preceding window.
  comparisonStartTime?: number;
  comparisonEndTime?: number;
}

export type WidgetEvent =
  | {
      type: 'TIME_CHANGE';
      payload: {
        startTime: string;
        endTime: string;
        periodicity: string;
        // Set only when the date picker's Compare mode is enabled and applied.
        comparisonStartTime?: string;
        comparisonEndTime?: string;
      };
    }
  | { type: 'FILTER_CHANGE'; payload: Record<string, unknown> };

// ---------------------------------------------------------------------------
// ColumnChart — widget-specific types
// ---------------------------------------------------------------------------

export interface ColumnChartSeriesConfig {
  _id: string;
  unsPath: string;   // bindable — stores {{uns:wsId://path}} (series binding)
  label: string;
  color?: string;
  unit?: string;
  precision?: number;
  yAxis?: 0 | 1;    // 0 = left (default), 1 = right
  chartType?: 'Column' | 'Line';  // rendering type for this series
}

export interface FixedSeriesConfig {
  _id: string;
  unsPath: string;   // bindable — stores {{uns:wsId://path}} (scalar binding)
  label: string;
  color?: string;
  yAxis?: 0 | 1;
  chartType?: 'Column' | 'Line';  // rendering type for this series
}

export interface StackConfig {
  _id: string;
  name: string;
  seriesIds: string[];   // _id refs into series[] and fixedSeries[]
}

export interface AxisConfig {
  _id: string;
  name: string;
  yAxis: 0 | 1;
  seriesIds: string[];   // _id refs into series[] and fixedSeries[]
}

// Stable ids for the two supported axes. The default Left axis (yAxis 0) always
// exists and cannot be deleted; the Right axis (yAxis 1) is optional/deletable.
export const LEFT_AXIS_ID = 'axis_left';
export const RIGHT_AXIS_ID = 'axis_right';

export type PlotLinePeriodicity = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface PlotLineConfig {
  _id: string;
  value: number | string;  // string = {{topic}} binding resolved at runtime
  label: string;
  color: string;
  width?: number;
  dashStyle?: 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'LongDash' | 'ShortDash';
  periodicityType?: 'independent' | 'dependent';
  periodicities?: PlotLinePeriodicity[];
  yAxis?: 0 | 1;   // which axis to draw against: 0 = left (default), 1 = right
}

export interface PlotBandConfig {
  _id: string;
  from: number | string;   // string = {{topic}} binding resolved at runtime
  to: number | string;
  label: string;
  color: string;
  yAxis?: 0 | 1;   // which axis to draw against: 0 = left (default), 1 = right
}

export type WidgetSizePreset = 'Small' | 'Medium' | 'Large' | 'Custom';

export interface WidgetSizeConfig {
  preset: WidgetSizePreset;
  width: number;
  height: number;
  locked?: boolean;
}

export interface WidgetElementsConfig {
  hideWidgetElements: boolean;
  hideSettingsIcon: boolean;
  hideExportIcon: boolean;
  hideChartTitle: boolean;
  hideInfoIcon: boolean;
}

export type WidgetFontWeight = 'Regular' | 'Medium' | 'Semi-Bold' | 'Bold';

export interface WidgetAdvancedSettingsConfig {
  enabled: boolean;
  titleFontSize: number;
  titleFontColor: string;
  titleFontWeight: WidgetFontWeight;
  xAxisTextColor: string;
  xAxisLineColor: string;
  yAxisTextColor: string;
  yAxisLineColor: string;
  gridLineColor: string;
  legendTextColor: string;
}

export interface ChartConfig {
  _id: string;
  title: string;
  description?: string;
  series: ColumnChartSeriesConfig[];
  fixedSeries: FixedSeriesConfig[];
  axes: AxisConfig[];
  stacks: StackConfig[];
  plotLines: PlotLineConfig[];
  plotBands: PlotBandConfig[];
}

export interface ColumnChartUIConfig {
  title: string;
  description?: string;
  charts: ChartConfig[];
  style: {
    card: {
      wrapInCard: boolean;
      bg: string;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: number;
    };
    stacked: boolean;
    showLegend: boolean;
    showDataLabels: boolean;
    yAxisUnit: string;
    widgetSize?: WidgetSizeConfig;
    widgetElements?: WidgetElementsConfig;
    advancedSettings?: WidgetAdvancedSettingsConfig;
  };
}

export interface ColumnChartEnvelope {
  _id: string;
  type: 'ColumnChart';
  general: { title: string };
  timeConfig?: TimeConfig;
  timeTabConfig?: Record<string, unknown>;
  uiConfig: ColumnChartUIConfig;
  dynamicBindingPathList: Array<BindingEntry>;
}
