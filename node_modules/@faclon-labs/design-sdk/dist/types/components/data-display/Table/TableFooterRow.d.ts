import type { HTMLAttributes, ReactNode } from 'react';
export interface TableFooterRowProps extends HTMLAttributes<HTMLTableRowElement> {
    children?: ReactNode;
}
export declare function TableFooterRow({ children, ...rest }: TableFooterRowProps): import("react/jsx-runtime").JSX.Element;
