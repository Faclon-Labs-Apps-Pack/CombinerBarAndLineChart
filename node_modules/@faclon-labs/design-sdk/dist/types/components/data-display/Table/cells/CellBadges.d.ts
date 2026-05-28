import './CellBadges.css';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { type BadgeColor, type BadgeEmphasis } from '../../../data-display/Badge/Badge';
export interface CellBadge {
    label: string;
    color?: BadgeColor;
    emphasis?: BadgeEmphasis;
    leadingIcon?: ReactNode;
}
export interface CellBadgesTrailingAction {
    icon: ReactNode;
    ariaLabel: string;
    onClick: (e: ReactMouseEvent) => void;
}
export interface CellBadgesProps {
    badges: CellBadge[];
    /**
     * Max number of visible badges before extras collapse into a neutral "+N"
     * badge. Default `3`. Mirrors the 3-slot rule used by `TableRowActions`.
     */
    maxVisible?: number;
    /** Optional trailing action icon (e.g., clear / remove). */
    trailingAction?: CellBadgesTrailingAction;
    className?: string;
}
/**
 * CellBadges — horizontal badge list with overflow support.
 * Drop inside `<TableCell contentType="badges">`. Maps to Figma node
 * 1313:12918. Uses DS `<Badge size="Small">` (20 px pill, matches Figma).
 */
export declare function CellBadges({ badges, maxVisible, trailingAction, className, }: CellBadgesProps): import("react/jsx-runtime").JSX.Element;
