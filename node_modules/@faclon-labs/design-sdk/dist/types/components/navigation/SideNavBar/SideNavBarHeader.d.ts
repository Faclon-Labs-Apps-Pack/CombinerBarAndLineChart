import { type ReactNode, type HTMLAttributes } from 'react';
export interface SideNavBarHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Brand slot — typically <Avatar> or logo icon. */
    brand?: ReactNode;
    /** Title text — visible only when expanded. */
    title?: string;
    /** Subtitle text under title — visible only when expanded. */
    subtitle?: string;
    /** Trailing slot — IconButton, Badge, ChevronsUpDown, etc. Hidden when collapsed. */
    trailing?: ReactNode;
}
export declare const SideNavBarHeader: import("react").ForwardRefExoticComponent<SideNavBarHeaderProps & import("react").RefAttributes<HTMLDivElement>>;
