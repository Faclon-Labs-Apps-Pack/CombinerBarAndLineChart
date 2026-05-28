import type { HTMLAttributes, ReactNode } from 'react';
import './DropdownHeader.css';
export interface DropdownHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Header title text */
    title: string;
    /** Header subtitle text */
    subtitle?: string;
    /** Leading item slot — pass DropdownLeadingItem */
    leadingItem?: ReactNode;
    /** Trailing item slot — pass DropdownTrailingItem */
    trailingItem?: ReactNode;
    /** Counter slot — shown next to the title */
    counter?: ReactNode;
}
export declare function DropdownHeader({ title, subtitle, leadingItem, trailingItem, counter, className, ...rest }: DropdownHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DropdownHeader {
    var displayName: string;
}
