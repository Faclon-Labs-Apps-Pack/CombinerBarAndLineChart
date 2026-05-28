import { type HTMLAttributes, type ReactNode } from 'react';
import type { BreadcrumbSize } from './BreadcrumbItem';
import './Breadcrumb.css';
export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
    /** Size passed down to all BreadcrumbItem children */
    size?: BreadcrumbSize;
    /** BreadcrumbItem children */
    children?: ReactNode;
}
export declare function Breadcrumb({ size, children, className, ...props }: BreadcrumbProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Breadcrumb {
    var displayName: string;
}
