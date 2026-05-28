import { type HTMLAttributes, type ReactNode } from 'react';
import './Tooltip.css';
export type TooltipPlacement = 'Top' | 'TopStart' | 'TopEnd' | 'Bottom' | 'BottomStart' | 'BottomEnd' | 'Left' | 'Right';
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Tooltip body text (required). */
    bodyText: string;
    /** Optional bold heading above the body. */
    heading?: string;
    /** Placement relative to the trigger. Default `'Top'`. May auto-flip when near a viewport edge. */
    placement?: TooltipPlacement;
    /** Controlled open state. */
    open?: boolean;
    /** Fires when the open state changes (hover / focus / Escape / programmatic). */
    onOpenChange?: (state: {
        isOpen: boolean;
    }) => void;
    /** Override z-index. Defaults to `--global-z-index-tooltip`. */
    zIndex?: number;
    /** Accessible label injected on the trigger via `aria-label`. Defaults to `bodyText`. */
    accessibilityLabel?: string;
    /** Trigger element(s). Single React element preferred (the trigger receives `aria-label`). */
    children: ReactNode;
}
export declare function Tooltip({ bodyText, heading, placement, open: controlledOpen, onOpenChange, zIndex, accessibilityLabel, children, className, ...props }: TooltipProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Tooltip {
    var displayName: string;
}
