import './TableEmptyState.css';
import type { ReactNode } from 'react';
import { type EmptyStateProps } from '../../feedback/EmptyState/EmptyState';
export interface TableEmptyStateProps extends Omit<EmptyStateProps, 'title'> {
    /**
     * Heading text. Defaults to `'No data to display'` — override for domain
     * copy ("No employees", "No results", etc.).
     */
    title?: string;
    /** Column count to span when mounted inside a `<tr>` in `<tbody>`. Default `1`. */
    colSpan?: number;
    /**
     * Wrap the `<EmptyState>` in `<tr><td colSpan={…}>` so it can be dropped
     * directly into a `<TableBody>` branch. Default `true`.
     *
     * Set to `false` to render the `<EmptyState>` bare — useful when you
     * want to place it above/below the table instead of inside the grid.
     */
    asCell?: boolean;
    /** Adjacent children rendered **outside** the empty-state box. Rare —
     *  most consumers pass `primaryAction` / `secondaryAction` instead. */
    children?: ReactNode;
}
/**
 * TableEmptyState — the DS `<EmptyState>` wrapped in a `<tr><td colSpan />`
 * so it can be dropped into a `<TableBody>` branch:
 *
 * ```tsx
 * <TableBody>
 *   {rows.length === 0 ? (
 *     <TableEmptyState
 *       colSpan={5}
 *       title="No employees to display"
 *       description="Add your first employee or adjust the filters."
 *       primaryAction={<Button label="Add employee" …/>}
 *     />
 *   ) : (
 *     rows.map((r) => <TableRow …/>)
 *   )}
 * </TableBody>
 * ```
 *
 * Defaults:
 *   - `illustration` — `<NoDataOneIllustration />` (the most common
 *      zero-state; override for 404 / access-denied / no-search etc.)
 *   - `title` — `'No data to display'`
 *
 * Full DS `<EmptyState>` prop surface (`description`, `primaryAction`,
 * `secondaryAction`, `helpText`, `helpLink`, `helpLinkIcon`, `size`) is
 * forwarded verbatim.
 */
export declare function TableEmptyState({ colSpan, asCell, illustration, title, className, children, ...emptyStateProps }: TableEmptyStateProps): import("react/jsx-runtime").JSX.Element;
