import './TableFooter.css';
import type { HTMLAttributes, ReactNode } from 'react';
export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
    children?: ReactNode;
}
/** Native `<tfoot>`. Used for column summaries / totals when needed. */
export declare function TableFooter({ children, ...rest }: TableFooterProps): import("react/jsx-runtime").JSX.Element;
