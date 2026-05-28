import './TableBody.css';
import type { HTMLAttributes, ReactNode } from 'react';
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
    children?: ReactNode;
}
export declare function TableBody({ children, ...rest }: TableBodyProps): import("react/jsx-runtime").JSX.Element;
