import './CellStatus.css';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { type IndicatorIntent } from '../../../data-display/Indicator/Indicator';
import { type BadgeColor, type BadgeEmphasis } from '../../../data-display/Badge/Badge';
export interface CellStatusBadge {
    label: string;
    color?: BadgeColor;
    emphasis?: BadgeEmphasis;
}
export interface CellStatusProps {
    /** Indicator intent — drives the dot color via DS Indicator tokens. */
    intent: IndicatorIntent;
    label: string;
    /** Indicator size. Default `'Medium'` (matches Figma's 14/20 text + 8 px dot). */
    size?: 'Small' | 'Medium' | 'Large';
    /** Up to 2 optional badges rendered after the Indicator. */
    badges?: CellStatusBadge[];
    /** Optional trailing action icon — e.g., dismiss, jump-to-detail. */
    trailingAction?: {
        icon: ReactNode;
        ariaLabel: string;
        onClick: (e: ReactMouseEvent) => void;
    };
    className?: string;
}
/**
 * CellStatus — Indicator (dot + label) + optional badges + optional action.
 * Drop inside `<TableCell contentType="status">`. Maps to Figma node
 * 3493:49982. Colors are owned by DS `<Indicator>` — no per-component
 * intent→color map to maintain.
 */
export declare function CellStatus({ intent, label, size, badges, trailingAction, className, }: CellStatusProps): import("react/jsx-runtime").JSX.Element;
