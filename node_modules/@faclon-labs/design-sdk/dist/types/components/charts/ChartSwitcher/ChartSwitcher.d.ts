import { type ReactNode } from 'react';
import type { ChartProps } from '../Chart/Chart';
import './ChartSwitcher.css';
export type SwitchableChartType = 'column' | 'line' | 'area' | 'bar' | 'pie';
export interface ChartSwitcherItem {
    /** Stable identifier. Defaults to its array index when omitted. */
    id?: string;
    /** Label shown in the dropdown menu. */
    label: string;
    /** Optional icon — overrides the type-derived icon. */
    icon?: ReactNode;
    /** Optional chart-type — drives the default icon when `icon` is not provided. */
    type?: SwitchableChartType;
    /** Chart instance rendered when this item is active. Pass any chart wrapper
     *  with `bare` set — e.g. `<ColumnChart bare series={...} categories={...} />`. */
    children: ReactNode;
}
export interface ChartSwitcherProps extends Omit<ChartProps, 'title' | 'children'> {
    /** Switchable items — the dropdown lists them in order. Must have at least one. */
    items: ChartSwitcherItem[];
    /** Active item id (controlled). */
    activeId?: string;
    /** Initial active item id (uncontrolled). Defaults to the first item's id. */
    defaultActiveId?: string;
    /** Fires when the user picks a different item. */
    onActiveChange?: (id: string) => void;
    /** Optional title prefix shown to the LEFT of the dropdown trigger. */
    titlePrefix?: string;
}
export declare const ChartSwitcher: import("react").ForwardRefExoticComponent<ChartSwitcherProps & import("react").RefAttributes<HTMLDivElement>>;
