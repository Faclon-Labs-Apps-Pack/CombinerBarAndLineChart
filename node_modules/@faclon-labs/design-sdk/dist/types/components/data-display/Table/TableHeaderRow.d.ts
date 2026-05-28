import type { HTMLAttributes, ReactNode } from 'react';
export interface TableHeaderRowProps extends HTMLAttributes<HTMLTableRowElement> {
    children?: ReactNode;
}
export declare function TableHeaderRow({ children, ...rest }: TableHeaderRowProps): import("react/jsx-runtime").JSX.Element;
