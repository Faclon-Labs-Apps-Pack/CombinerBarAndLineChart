import { type MouseEvent, type ReactNode } from 'react';
export interface SideNavBarMenuActionProps {
    /** Icon for the action — typically 16 px. */
    icon: ReactNode;
    /** Click handler. */
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    /** Accessible label for the icon button. */
    accessibilityLabel: string;
    className?: string;
}
/**
 * Trailing action slot for a SideNavBarMenuButton — typically a chevron, gear,
 * or other secondary affordance. Renders as a 16 px IconButton. Hidden when
 * sidebar is collapsed (the parent button hides its trailing slot).
 */
export declare const SideNavBarMenuAction: import("react").ForwardRefExoticComponent<SideNavBarMenuActionProps & import("react").RefAttributes<HTMLButtonElement>>;
