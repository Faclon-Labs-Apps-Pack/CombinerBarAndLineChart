import './TableHeaderCell.css';
import type { ReactNode, ThHTMLAttributes } from 'react';
export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
    /** Sort key — when set and matched in `sortFunctions`, cell becomes a sort button. */
    headerKey?: string;
    /** Freeze this column to the left edge (sticky). First column only in v1. */
    isSticky?: boolean;
    /** Optional `(i)` info icon next to the header text — pass any truthy value
     *  to show the icon (string is reserved for tooltip text in a future iter). */
    infoTooltip?: ReactNode | string | boolean;
    children?: ReactNode;
}
export declare function TableHeaderCell({ children, infoTooltip, className, ...rest }: TableHeaderCellProps): import("react/jsx-runtime").JSX.Element;
