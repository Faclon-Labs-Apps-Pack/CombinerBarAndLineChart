import './TablePagination.css';
export type TablePaginationVariant = 'simple' | 'numbered';
export interface TablePaginationProps {
    /** Page sizes to show in the picker. Default `[10, 25, 50, 100]`. */
    pageSizeOptions?: number[];
    /** Override the total-row count shown in the label. Prefer setting
     *  `rowCount` on the parent `<Table>` — it flows here via context — and
     *  only use this prop if you need a per-pagination override. For
     *  server-driven pagination, set `rowCount` on `<Table>` and use
     *  controlled `page`/`pageSize` props. */
    totalItemCount?: number;
    /** Show the page-size dropdown. Default `true`. */
    showRowsPerPage?: boolean;
    /** Show the "Showing N of T" label on the left. Default `true`. */
    showLabel?: boolean;
    /** `'simple'` = prev/next arrows; `'numbered'` = full page numbers (1 ... 5 6 [7] 8 9 ... 20). */
    variant?: TablePaginationVariant;
    /** Override the auto-generated label. */
    label?: string | ((args: {
        start: number;
        end: number;
        total: number;
    }) => string);
    /** When `true` (default), changing page size resets to page 1. Set to `false`
     *  for server-driven pagination where the parent manages page state. */
    resetPageOnSizeChange?: boolean;
    onPageChange?: (args: {
        page: number;
    }) => void;
    onPageSizeChange?: (args: {
        pageSize: number;
    }) => void;
    className?: string;
}
/**
 * TablePagination — Figma 1313:14707.
 *
 * Four layout variants based on `showLabel × showRowsPerPage × variant`:
 *   - showLabel + showRowsPerPage  → "Showing N of T" + size + < >
 *   - showLabel only               → "Showing N of T" + < >
 *   - showRowsPerPage only         → size + < >  (right-aligned)
 *   - variant='numbered'           → page numbers right-aligned
 *
 * Page-size dropdown renders via `createPortal` to `document.body` so it's
 * never clipped by the surface's `overflow: hidden`. Position is computed
 * from the trigger's bounding rect on open + on resize.
 */
export declare function TablePagination({ pageSizeOptions, totalItemCount, showRowsPerPage, showLabel, variant, label, resetPageOnSizeChange, onPageChange, onPageSizeChange, className, }?: TablePaginationProps): import("react/jsx-runtime").JSX.Element | null;
