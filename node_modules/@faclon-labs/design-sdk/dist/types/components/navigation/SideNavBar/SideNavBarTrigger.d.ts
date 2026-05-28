import { type ReactNode } from 'react';
export interface SideNavBarTriggerProps {
    /** Override icon (defaults to a hamburger menu icon). */
    icon?: ReactNode;
    /** Accessible label. @default 'Toggle navigation' */
    accessibilityLabel?: string;
    className?: string;
}
export declare const SideNavBarTrigger: import("react").ForwardRefExoticComponent<SideNavBarTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
