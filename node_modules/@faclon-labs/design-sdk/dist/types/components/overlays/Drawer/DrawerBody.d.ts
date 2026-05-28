import type { HTMLAttributes, ReactNode } from 'react';
import './DrawerBody.css';
export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    /** Toggle the default 20 px padding. @default true */
    hasPadding?: boolean;
}
export declare function DrawerBody({ children, hasPadding, className, ...props }: DrawerBodyProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DrawerBody {
    var displayName: string;
}
