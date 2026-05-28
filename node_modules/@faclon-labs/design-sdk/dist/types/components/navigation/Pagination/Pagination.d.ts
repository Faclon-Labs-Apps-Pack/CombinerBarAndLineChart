import { type HTMLAttributes } from 'react';
import './Pagination.css';
export type PaginationVariant = 'default' | 'simple' | 'jumper';
export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
    /** Total number of pages */
    totalPages: number;
    /** Controlled current page (1-based). When omitted, the component is uncontrolled. */
    currentPage?: number;
    /** Initial page for uncontrolled usage. Default `1`. */
    defaultPage?: number;
    /** Called when the page changes. */
    onPageChange?: (page: number) => void;
    /** Variant — `default` shows page numbers, `simple` only prev/next, `jumper` shows an input. Default `'default'`. */
    variant?: PaginationVariant;
    /** Number of sibling pages around the current page. Default `2`. */
    siblingCount?: number;
    /** Disables every control. */
    isDisabled?: boolean;
    /** Show the items-per-page picker on the trailing side. Default `false`. */
    showPageSizePicker?: boolean;
    /** Controlled page size. */
    pageSize?: number;
    /** Initial page size for uncontrolled usage. Default `10`. */
    defaultPageSize?: number;
    /** Options shown in the page-size picker. Default `[10, 25, 50]`. */
    pageSizeOptions?: number[];
    /** Trailing label after the picker. Default `'items / page'`. */
    pageSizeLabel?: string;
    /** Called when the page size changes. */
    onPageSizeChange?: (size: number) => void;
    /** Show the leading label. Default `false`. */
    showLabel?: boolean;
    /** Custom label text. Defaults to `Page X of Y`. */
    label?: string;
}
export declare function Pagination({ totalPages, currentPage, defaultPage, onPageChange, variant, siblingCount, isDisabled, showPageSizePicker, pageSize, defaultPageSize, pageSizeOptions, pageSizeLabel, onPageSizeChange, showLabel, label, className, ...props }: PaginationProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace Pagination {
    var displayName: string;
}
