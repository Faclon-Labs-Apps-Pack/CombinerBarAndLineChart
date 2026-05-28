import type { ReactNode } from 'react';
export type Identifier = string | number;
export type SelectionType = 'none' | 'single' | 'multiple';
export type MultiSelectTrigger = 'row' | 'checkbox';
/** Row density. `'compact'` = 40 px row height, `'expanded'` = 48 px. */
export type RowDensity = 'compact' | 'expanded';
export type SortDirection = 'asc' | 'desc';
export interface TableNode {
    id: Identifier;
    [key: string]: unknown;
}
export interface TableData<Item extends TableNode = TableNode> {
    nodes: Item[];
}
export interface SortState {
    sortKey: string;
    direction: SortDirection;
}
export interface PaginationState {
    page: number;
    size: number;
}
export interface TableProps<Item extends TableNode = TableNode> {
    data: TableData<Item>;
    /** Override the total-row count shown in pagination labels — required for
     *  server-driven pagination where `data.nodes` only holds the current page. */
    rowCount?: number;
    selectionType?: SelectionType;
    defaultSelectedIds?: Identifier[];
    onSelectionChange?: (args: {
        values: Item[];
    }) => void;
    isRowSelectable?: (item: Item) => boolean;
    multiSelectTrigger?: MultiSelectTrigger;
    sortFunctions?: Record<string, (arr: Item[]) => Item[]>;
    defaultSort?: SortState;
    onSortChange?: (state: SortState | null) => void;
    pagination?: boolean;
    defaultPageSize?: number;
    pageSize?: number;
    page?: number;
    onPaginationChange?: (state: PaginationState) => void;
    defaultExpandedIds?: Identifier[];
    onExpansionChange?: (ids: Identifier[]) => void;
    isGrouped?: boolean;
    rowDensity?: RowDensity;
    /**
     * Adds vertical column dividers (`border-right` on every cell except the
     * last). Per Figma 1313:15128 — opt-in variant; default Figma table has
     * only horizontal row dividers.
     */
    showBorderedCells?: boolean;
    isHeaderSticky?: boolean;
    isFirstColumnSticky?: boolean;
    /**
     * Pins the LAST cell in every row (header + body + footer) to the right
     * edge. Use only for the trailing action column (Edit / Delete / overflow
     * menu). Per design direction: right-sticky is reserved for actions —
     * frozen-from-left handles every other case.
     */
    hasStickyActionColumn?: boolean;
    /**
     * Caps the table's outer height; combined with `isHeaderSticky` (default
     * true), rows scroll vertically beneath a pinned header. Pass any CSS
     * height value (`number` → px, or string like `'70vh'`).
     */
    maxHeight?: number | string;
    /** Renders `<TableSkeleton>` shimmer rows instead of the render-prop content.
     *  Use only for initial load — use `isRefreshing` for subsequent fetches so
     *  the existing rows stay visible. */
    isLoading?: boolean;
    /** Overlays a spinner on top of the rows without destroying them. */
    isRefreshing?: boolean;
    /** Toolbar slot — rendered above the scroll area. Typically a `<TableToolbar>`. */
    toolbar?: ReactNode;
    /** Footer slot — rendered below the scroll area. Typically a `<TablePagination>`. */
    footer?: ReactNode;
    children: (rows: Item[]) => ReactNode;
}
