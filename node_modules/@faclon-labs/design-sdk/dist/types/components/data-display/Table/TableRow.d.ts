import './TableRow.css';
import type { HTMLAttributes, ReactNode } from 'react';
export interface TableRowProps<Item = unknown> extends Omit<HTMLAttributes<HTMLTableRowElement>, 'onClick'> {
    /** The data item this row represents. Required for selection / expansion / disabled checks. */
    item: Item;
    /** Row click — fires regardless of selection. Used for "open detail" UX. */
    onClick?: (item: Item) => void;
    children?: ReactNode;
}
export declare function TableRow<Item = unknown>({ children, item, onClick, ...rest }: TableRowProps<Item>): import("react/jsx-runtime").JSX.Element;
