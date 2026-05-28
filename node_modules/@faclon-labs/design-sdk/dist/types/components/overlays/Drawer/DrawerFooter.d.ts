import type { HTMLAttributes, ReactNode } from 'react';
import './DrawerFooter.css';
export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    /** Render the top divider. @default true */
    showDivider?: boolean;
}
export declare function DrawerFooter({ children, showDivider, className, ...props }: DrawerFooterProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DrawerFooter {
    var displayName: string;
}
