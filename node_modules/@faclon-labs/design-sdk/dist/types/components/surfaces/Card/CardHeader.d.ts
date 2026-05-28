import type { HTMLAttributes, ReactNode } from 'react';
import './CardHeader.css';
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Header title text */
    title: string;
    /** Header subtitle text */
    subtitle?: string;
    /** Leading item slot — pass CardLeadingItem or icon */
    leadingItem?: ReactNode;
    /** Trailing item slot — pass CardTrailingItem with Badge/Link/IconButton */
    trailingItem?: ReactNode;
    /** Counter slot — shown next to the title */
    counter?: ReactNode;
    /** Show bottom divider */
    showDivider?: boolean;
}
export declare function CardHeader({ title, subtitle, leadingItem, trailingItem, counter, showDivider, className, ...rest }: CardHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace CardHeader {
    var displayName: string;
}
