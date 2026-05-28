import type { HTMLAttributes, ReactNode } from 'react';
import './DropdownTrailingItem.css';
export type DropdownTrailingType = 'Action' | 'Link' | 'Badge' | 'Text';
export interface DropdownTrailingItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Type of trailing item — controls layout wrapper */
    trailing?: DropdownTrailingType;
    /**
     * Content slot.
     * - trailing='Action' → pass an IconButton (XSmall)
     * - trailing='Link'   → pass a LinkButton
     * - trailing='Badge'  → pass a Badge component
     * - trailing='Text'   → pass a text string or element
     */
    children?: ReactNode;
}
export declare function DropdownTrailingItem({ trailing, children, className, ...rest }: DropdownTrailingItemProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace DropdownTrailingItem {
    var displayName: string;
}
