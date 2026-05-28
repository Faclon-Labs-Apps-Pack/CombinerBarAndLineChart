import './TableSkeleton.css';
export interface TableSkeletonProps {
    /** Number of shimmer rows to render. Default `5`. */
    rows?: number;
    /** Number of shimmer cells per row. Must match the real column count so
     *  the skeleton lines up with the table's grid once data arrives. */
    columns: number;
}
/**
 * TableSkeleton — shimmer loading state. Render inside a `<TableBody>` when
 * `context.isLoading` is `true`; consumers typically guard it with the prop:
 *
 * ```tsx
 * <TableBody>
 *   {isLoading
 *     ? <TableSkeleton rows={10} columns={5} />
 *     : rows.map(r => <TableRow item={r}>...</TableRow>)}
 * </TableBody>
 * ```
 *
 * Renders native `<tr>/<td>` so it sits inside a `<tbody>` without breaking
 * table semantics. The animated bar is a pure-CSS gradient sweep — no JS.
 */
export declare function TableSkeleton({ rows, columns }: TableSkeletonProps): import("react/jsx-runtime").JSX.Element;
