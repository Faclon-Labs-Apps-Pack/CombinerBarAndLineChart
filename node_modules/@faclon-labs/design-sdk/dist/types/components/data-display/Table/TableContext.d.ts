import { type RefObject } from 'react';
import type { Identifier, MultiSelectTrigger, PaginationState, RowDensity, SelectionType, SortState, TableNode } from './types';
export interface TableContextValue<Item extends TableNode = TableNode> {
    data: {
        nodes: Item[];
    };
    totalItems: number;
    selectionType: SelectionType;
    multiSelectTrigger: MultiSelectTrigger;
    selectedIds: Identifier[];
    toggleRowSelection: (id: Identifier) => void;
    /** Engine's shift-click range select. Pass the row id and the SAME modifier
     *  the table is currently using (sort × pagination chain) so the engine can
     *  walk the visible-row order. */
    toggleRowSelectionRange: (id: Identifier) => void;
    toggleAllRowsSelection: () => void;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    /** Per-item selectability predicate. Disabled rows skip the header
     *  "select all" tally and render a disabled checkbox in the row. */
    isRowSelectable: (item: TableNode) => boolean;
    sortState: SortState | null;
    sortableKeys: string[];
    toggleSort: (sortKey: string) => void;
    pageState: PaginationState;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    expandedIds: Identifier[];
    toggleExpansion: (id: Identifier) => void;
    isGrouped: boolean;
    rowDensity: RowDensity;
    isLoading: boolean;
    isRefreshing: boolean;
    isHeaderSticky: boolean;
    isFirstColumnSticky: boolean;
    hasStickyActionColumn: boolean;
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    isScrolledHorizontally: boolean;
}
export declare const TableContext: import("react").Context<TableContextValue<TableNode> | null>;
export declare function useTableContext<Item extends TableNode = TableNode>(): TableContextValue<Item>;
export declare function useTableContextOptional<Item extends TableNode = TableNode>(): TableContextValue<Item> | null;
