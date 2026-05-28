import type { ReactNode, TdHTMLAttributes } from 'react';
export interface TableFooterCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
}
export declare function TableFooterCell({ children, className, ...rest }: TableFooterCellProps): import("react/jsx-runtime").JSX.Element;
