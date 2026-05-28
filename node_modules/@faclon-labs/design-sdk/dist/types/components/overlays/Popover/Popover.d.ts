import { type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import './Popover.css';
export type PopoverPlacement = 'Top' | 'Top Start' | 'Top End' | 'Right' | 'Right Start' | 'Right End' | 'Bottom' | 'Bottom Start' | 'Bottom End' | 'Left' | 'Left Start' | 'Left End';
export type PopoverOpenInteraction = 'click' | 'hover';
export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Element that opens the popover (button, link, avatar, etc.) */
    trigger: ReactNode;
    /** Popover content — typically `<PopoverHeader />`, `<PopoverBody />`, `<PopoverFooter />`. */
    children: ReactNode;
    /** Controlled open state */
    isOpen?: boolean;
    /** Called whenever the open state should change (controlled + uncontrolled) */
    onOpenChange?: (open: boolean) => void;
    /** Starting open state for uncontrolled usage */
    defaultOpen?: boolean;
    /** Position relative to the trigger. Default `'Bottom'`. */
    placement?: PopoverPlacement;
    /** How the trigger opens the popover. Default `'click'`. */
    openInteraction?: PopoverOpenInteraction;
    /** Custom element to focus when the popover opens. Defaults to the first focusable inside the panel. */
    initialFocusRef?: RefObject<HTMLElement>;
    /** Override the panel z-index. Defaults to `--fds-z-popover` (100). */
    zIndex?: number;
    /** Accessibility label for the popover panel */
    'aria-label'?: string;
}
export declare const Popover: import("react").ForwardRefExoticComponent<PopoverProps & import("react").RefAttributes<HTMLDivElement>>;
