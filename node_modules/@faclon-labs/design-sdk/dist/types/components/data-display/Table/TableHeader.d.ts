import './TableHeader.css';
import type { HTMLAttributes, ReactNode } from 'react';
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
    children?: ReactNode;
}
/** Native `<thead>`. Sticky-top is owned by `<th>` elements when
 *  `isHeaderSticky` is on (default). */
export declare function TableHeader({ children, ...rest }: TableHeaderProps): import("react/jsx-runtime").JSX.Element;
