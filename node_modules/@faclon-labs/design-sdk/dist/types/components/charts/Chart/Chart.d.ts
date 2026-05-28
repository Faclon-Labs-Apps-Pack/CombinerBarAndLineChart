import { type HTMLAttributes, type ReactNode } from 'react';
import './Chart.css';
export type ChartTitleSize = 'Small' | 'Medium' | 'Large';
/**
 * A horizontal reference line drawn across the plot area at a fixed Y value.
 * Maps directly to Highcharts `yAxis.plotLines`. Commonly used for threshold
 * annotations (Warning / Critical limits in IOLens widgets).
 */
export interface ChartPlotLine {
    /** Y-axis value where the line is drawn */
    value: number;
    /** Line colour — any valid CSS colour or hex string */
    color?: string;
    /** Line thickness in pixels @default 2 */
    width?: number;
    /** Stroke pattern @default 'Dash' */
    dashStyle?: 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'LongDash' | 'ShortDash';
    /** Optional label text rendered beside the line */
    label?: string;
    /** Label horizontal alignment @default 'right' */
    labelAlign?: 'left' | 'center' | 'right';
    /** Stacking z-index so lines appear above series @default 5 */
    zIndex?: number;
}
/**
 * A shaded band spanning a Y value range across the plot area.
 * Maps to Highcharts `yAxis.plotBands`. More visually prominent than a
 * plotLine — use bands for threshold zones (e.g. warning 80–90, critical 90+)
 * and lines for single threshold markers.
 */
export interface ChartPlotBand {
    /** Lower Y-axis bound of the band */
    from: number;
    /** Upper Y-axis bound of the band. Use `Infinity` for open-ended top bands. */
    to: number;
    /** Fill colour — use a semi-transparent value e.g. `'rgba(249,115,22,0.15)'` */
    color?: string;
    /** Optional label text rendered inside the band */
    label?: string;
    /** Label horizontal alignment @default 'right' */
    labelAlign?: 'left' | 'center' | 'right';
    /** Stacking z-index @default 0 (behind series by default for bands) */
    zIndex?: number;
}
/**
 * Shape of the context object passed to `onPointClick` on axis charts.
 * Used by consumers to implement time drill-down: click a point → consumer
 * inspects `category` / `pointIndex` and re-feeds the chart with data for
 * the next hierarchy level (e.g. Daily → Hourly for that day).
 */
export interface ChartPointClickContext {
    /** The category label of the clicked point (e.g. "Mar 12", "12:00"). */
    category: string;
    /** Name of the series the point belongs to. */
    seriesName: string;
    /** Numeric value of the clicked point, or null if the point has no value. */
    value: number | null;
    /** Zero-based index of the point inside its series's `data` array. */
    pointIndex: number;
    /** Zero-based index of the series among the chart's series list. */
    seriesIndex: number;
}
/**
 * Maps a title size to the corresponding semibold heading typography utility
 * class. Kept on the Chart module so consumers can reference the same map if
 * they're rendering a fully custom title slot but want to match the default.
 */
export declare const CHART_TITLE_TYPOGRAPHY: Record<ChartTitleSize, string>;
export interface ChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /**
     * Chart title. Pass a string to render the default Faclon-styled title
     * trigger. Pass a ReactNode to slot a custom node — typically a
     * `DropdownMenu` trigger for a chart-type selector.
     */
    title?: ReactNode;
    /**
     * Title font size — only used when `title` is a string. Maps to the
     * matching `Heading{Size}Semibold` typography utility class.
     * @default 'Small'
     */
    titleSize?: ChartTitleSize;
    /**
     * Extra class applied to the default title trigger button — only used when
     * `title` is a string. Use this to override the default text color
     * (e.g. `"text-gray-secondary"`) or apply any other custom styling.
     */
    titleClassName?: string;
    /**
     * Whether to render the dropdown chevron after the title. Set to `true`
     * when the widget contains more than one chart type so the title becomes a
     * visible switcher trigger. Only applies when `title` is a string.
     * @default false
     */
    titleHasDropdown?: boolean;
    /** Click handler used when `title` is a string */
    onTitleClick?: () => void;
    /** Breadcrumb element — typically a `<Breadcrumb>...</Breadcrumb>` */
    breadcrumb?: ReactNode;
    /**
     * Duration / time-range label rendered below the header row, inside the
     * same header container. Pass a string (e.g. `"Duration: This Year"`) or
     * any ReactNode. A leading clock icon is rendered automatically. Omit to
     * hide the row.
     */
    duration?: ReactNode;
    /**
     * Action buttons rendered on the right of the header.
     * Pass `<IconButton>` elements (info / settings / more etc.).
     * Omit to hide the actions group.
     */
    actions?: ReactNode;
    /**
     * Filter / toolbar row rendered between the header and the canvas.
     * Typically a `<DatePicker mode="range" />`. Omit to hide the row.
     */
    filters?: ReactNode;
    /**
     * Chart canvas content — the actual chart instance
     * (e.g. `<HighchartsReact .../>`). This is the slot every chart type
     * shares against the same base.
     */
    children?: ReactNode;
}
export declare const Chart: import("react").ForwardRefExoticComponent<ChartProps & import("react").RefAttributes<HTMLDivElement>>;
