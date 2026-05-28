import type { HTMLAttributes, ReactNode } from 'react';
export interface TableToolbarActionsProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
export declare function TableToolbarActions({ children, ...rest }: TableToolbarActionsProps): import("react/jsx-runtime").JSX.Element;
