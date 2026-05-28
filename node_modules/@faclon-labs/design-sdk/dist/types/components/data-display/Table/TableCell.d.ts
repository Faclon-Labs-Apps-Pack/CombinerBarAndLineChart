import './TableCell.css';
import type { ReactNode, TdHTMLAttributes } from 'react';
/**
 * Cell content shapes from Figma (node 1313:12838 + siblings). Drives
 * alignment + width via `data-content-type` on the `<td>`. Each value maps
 * to a cell-content component under `./cells/` (except `spacer` and `slot`,
 * which are structural-only).
 */
export type CellContentType = 'text' | 'text-action' | 'checkbox' | 'icon' | 'actions' | 'badges' | 'buttons' | 'status' | 'spacer' | 'slot';
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
    /** Freeze this cell to the left edge (sticky). Should match its header cell. */
    isSticky?: boolean;
    /**
     * Cell content shape — drives alignment, width, and inner layout via CSS.
     * Default `'text'`. Use one of the `<Cell…>` primitives from
     * `@faclon-labs/design-sdk` as the child when using a non-default type.
     */
    contentType?: CellContentType;
    children?: ReactNode;
}
export declare function TableCell({ children, className, contentType, ...rest }: TableCellProps): import("react/jsx-runtime").JSX.Element;
