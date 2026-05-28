export interface GTPPreset {
    id: string;
    label: string;
    x?: number;
    xPeriod?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    calendarType?: 'today' | 'yesterday' | 'current_week' | 'previous_week' | 'current_month' | 'previous_month';
    isBuiltIn?: boolean;
    navigation?: string;
    xEvent?: string;
    y?: number;
    yPeriod?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    yEvent?: string;
    periodicities?: string[];
    /** When true, the custom preset is hidden from the active picker list but kept in management state so the user can unhide it. */
    hidden?: boolean;
}
export interface GTPShift {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    color: string;
}
export interface GTPCycleTimeConfig {
    identifier: 'start' | 'end';
    hour: string;
    minute: string;
    dayOfWeek: number | null;
    date: string;
    month: string;
    year: string;
}
export type GTPTimeType = 'fixed' | 'local' | 'global';
/** A "Global Time Picker" registered in the host environment. When the user selects
 *  one of these in the Link Time With dropdown (Global mode), its full configuration
 *  is displayed READ-ONLY in the time tab — only per-widget display settings
 *  (comparison mode / deviation indicator / future days) remain editable. */
export interface GTPGlobalTimepicker {
    id: string;
    name: string;
    /** Inherited timezone shown in the read-only TimeZone field. */
    timezone?: string;
    /** Inherited cycle-time configuration shown in the read-only Cycle Time accordion. */
    cycleTime?: GTPCycleTimeConfig;
    /** Inherited duration list (built-ins + customs). The entry whose id matches
     *  `defaultDurationId` is rendered with the active-default check icon. */
    allDurations?: GTPPreset[];
    defaultDurationId?: string;
    /** Inherited shifts shown in the read-only Shift accordion. */
    shifts?: GTPShift[];
    /** Inherited shift aggregator shown in the disabled SelectInput below the shift list. */
    shiftAggregator?: string;
    /** Inherited Comparison Mode flag — when true, the GTP turns deviation indicators on
     *  and the time tab shows the indicator pattern selector. Rendered as a disabled
     *  Switch reflecting this value; the per-widget toggle is no longer user-editable. */
    comparisonMode?: boolean;
    /** Inherited future-days-allowed limit. Shown as a disabled TextInput in Global mode. */
    futureDaysAllowed?: string;
}
/** Per-widget settings when the picker is set to Global. Most of the configuration
 *  is inherited from the selected `GTPGlobalTimepicker`; these are the user-editable
 *  overlay fields. */
export interface GTPGlobalSettings {
    /** Which `GTPGlobalTimepicker.id` is currently linked. */
    globalTimepickerId: string;
    comparisonMode: boolean;
    deviationPattern: GTPDeviationPattern;
    allowPerSourceIndicator: boolean;
    sourceDeviationOverrides: Record<string, GTPDeviationPattern>;
    futureDaysAllowed: string;
}
/** Deviation indicator pattern shown when Comparison Mode is on. */
export type GTPDeviationPattern = 'green-up-positive' | 'red-up-positive';
/** A single data source/device within one chart of the host widget. */
export interface GTPChartSource {
    id: string;
    name: string;
}
/** A chart in the host widget — used to render per-source deviation overrides
 *  when Comparison Mode + Advance Settings are both on. */
export interface GTPChart {
    id: string;
    name: string;
    sources: GTPChartSource[];
}
/** Inline "Set Duration" form values used by the Fixed Time Picker. Unlike Local
 *  (which manages a *list* of presets via the Duration accordion), Fixed exposes
 *  ONE duration configured directly in the form. */
export interface GTPFixedDuration {
    name: string;
    navigation: string;
    x: string;
    xPeriod: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    xEvent: string;
    y: string;
    yPeriod: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    yEvent: string;
    /** Single periodicity (not multi-select like Local's tags). */
    periodicity: string;
}
/** Full settings scoped to the Fixed Time Picker. Mirrors Local's settings but
 *  with a single inline duration instead of a managed list. */
export interface GTPFixedSettings {
    timezone: string;
    cycleTime: GTPCycleTimeConfig;
    duration: GTPFixedDuration;
    shifts: GTPShift[];
    shiftAggregator: string;
    comparisonMode: boolean;
    deviationPattern: GTPDeviationPattern;
    allowPerSourceIndicator: boolean;
    sourceDeviationOverrides: Record<string, GTPDeviationPattern>;
    futureDaysAllowed: string;
}
export interface TimeTabUIConfig {
    /** Reference source whose time this widget's time is linked to. */
    linkTimeWith?: string;
    timezone: string;
    /** @deprecated Replaced by `linkTimeWith` in the new design. Kept for back-compat. */
    timeType?: GTPTimeType;
    /** @deprecated Replaced by `linkTimeWith` in the new design. Kept for back-compat. */
    globalTimepickerId?: string;
    defaultDurationId: string;
    allDurations: GTPPreset[];
    defaultPeriodicity: 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    /** @deprecated Removed from the visible UI in the new design. Kept for back-compat. */
    disablePeriodicities?: boolean;
    comparisonMode?: boolean;
    /** Which up/down color pattern signals positive vs negative deviation. Only meaningful when `comparisonMode` is true. */
    deviationPattern?: GTPDeviationPattern;
    /** @deprecated Removed from the visible UI in the new design. Kept for back-compat. */
    disableTimeSelection?: boolean;
    /** When true, each data source can override the comparison indicator pattern. */
    allowPerSourceIndicator?: boolean;
    /** Per-source deviation pattern overrides. Keyed by `${chartId}:${sourceId}`. */
    sourceDeviationOverrides?: Record<string, GTPDeviationPattern>;
    futureDaysAllowed?: string;
    shifts?: GTPShift[];
    shiftAggregator?: string;
    cycleTime?: GTPCycleTimeConfig;
    /** Settings scoped to the Fixed Time Picker. Local picker's settings remain at the
     *  top level for back-compat; per-picker scopes will grow here over time. */
    fixed?: GTPFixedSettings;
    /** Settings scoped to the Global Time Picker (which globalTimepicker is linked +
     *  per-widget display settings). Inherited fields are NOT stored here — they're
     *  looked up from the `globalTimepickers` prop. */
    global?: GTPGlobalSettings;
}
