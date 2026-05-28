import { type ReactNode, type HTMLAttributes } from 'react';
export interface SideNavBarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
/**
 * Signature swap behavior: renders the text label when the sidebar is expanded,
 * a horizontal divider line when collapsed. Both renders live in the DOM and
 * toggle visibility via CSS based on the parent SideNavBar's data-state.
 */
export declare const SideNavBarGroupLabel: import("react").ForwardRefExoticComponent<SideNavBarGroupLabelProps & import("react").RefAttributes<HTMLDivElement>>;
