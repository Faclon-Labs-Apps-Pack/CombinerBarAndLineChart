import type { TableContextValue } from '../TableContext';
import type { TableNode, TableProps } from '../types';
/**
 * useTableEngine — wires `@table-library/react-table-library` (selection,
 * sort, pagination, tree) to Faclon's controlled-prop surface and returns
 * the memoised `{ ctx, processedRows, scrollContainerRef }` that `<Table>`
 * pushes into `<TableContext>`.
 *
 * Kept in a sibling hook so `<Table>` itself stays a thin render wrapper —
 * all engine adapter logic (which is volume-wise ~80% of the component)
 * lives here. Import paths are one level deeper than Table.tsx so relative
 * references bump up an extra `..`.
 *
 * **Dev-mode warnings** about missing row ids, `isHeaderSticky` without
 * `maxHeight`, and controlled pagination without `rowCount` fire from this
 * hook — see the Gotchas block in `Table.tsx` for the consumer-facing rules.
 */
export declare function useTableEngine<Item extends TableNode = TableNode>(props: TableProps<Item>): {
    ctx: TableContextValue<Item>;
    processedRows: Item[];
    scrollContainerRef: import("react").MutableRefObject<HTMLDivElement | null>;
};
