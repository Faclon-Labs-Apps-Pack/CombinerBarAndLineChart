import { type ReactNode, type HTMLAttributes } from 'react';
export interface SideNavBarMenuBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
}
/**
 * Trailing badge slot for a SideNavBarMenuButton (e.g. wrap a `<Badge>`).
 * Hidden when sidebar is collapsed (the parent button hides its trailing slot).
 */
export declare const SideNavBarMenuBadge: import("react").ForwardRefExoticComponent<SideNavBarMenuBadgeProps & import("react").RefAttributes<HTMLSpanElement>>;
