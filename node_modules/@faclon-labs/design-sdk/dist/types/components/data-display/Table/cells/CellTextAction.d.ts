import './CellTextAction.css';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
export interface CellTextActionDescriptor {
    /** 20 px icon, typically from react-feather. */
    icon: ReactNode;
    /** Aria-label for the trailing IconButton. */
    ariaLabel: string;
    onClick: (e: ReactMouseEvent) => void;
    /** Show the action unconditionally instead of hover-reveal. Default `false`. */
    alwaysVisible?: boolean;
}
export interface CellTextActionProps {
    title: string;
    description?: string;
    leading?: ReactNode;
    /**
     * Trailing action icon. Hidden by default; revealed when the enclosing
     * `<TableRow>` is hovered/focused (CSS rule — no JS listeners). Pass
     * `alwaysVisible: true` to pin it on.
     */
    trailingAction: CellTextActionDescriptor;
    className?: string;
}
/**
 * CellTextAction — text cell with a hover-revealed trailing action icon.
 * Drop inside `<TableCell contentType="text-action">`. Maps to Figma
 * node 1966:4367 (`Text (Action Icon)` variant).
 */
export declare function CellTextAction({ title, description, leading, trailingAction, className, }: CellTextActionProps): import("react/jsx-runtime").JSX.Element;
