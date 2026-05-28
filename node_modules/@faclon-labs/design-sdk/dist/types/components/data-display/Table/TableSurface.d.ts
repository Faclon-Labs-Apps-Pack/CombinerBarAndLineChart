import type { HTMLAttributes, ReactNode } from 'react';
export interface TableSurfaceProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
export declare function TableSurface({ children, ...rest }: TableSurfaceProps): import("react/jsx-runtime").JSX.Element;
