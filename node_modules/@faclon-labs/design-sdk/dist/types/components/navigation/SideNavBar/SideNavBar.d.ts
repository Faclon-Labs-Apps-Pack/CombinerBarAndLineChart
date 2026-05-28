import { type ReactNode, type HTMLAttributes } from 'react';
import './SideNavBar.css';
export type SideNavBarSide = 'left' | 'right';
export type SideNavBarCollapsible = 'icon' | 'offcanvas' | 'none';
export interface SideNavBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    /** Side of the screen. @default 'left' */
    side?: SideNavBarSide;
    /** Collapsible behavior. @default 'icon' */
    collapsible?: SideNavBarCollapsible;
    children: ReactNode;
}
export declare const SideNavBar: import("react").ForwardRefExoticComponent<SideNavBarProps & import("react").RefAttributes<HTMLElement>>;
