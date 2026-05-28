import type { HTMLAttributes, ReactNode } from 'react';
import './BreadcrumbItem.css';
export type BreadcrumbItemType = 'Text' | 'Icon';
export type BreadcrumbSize = 'Small' | 'Medium' | 'Large';
export interface BreadcrumbItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'onClick'> {
    /** Whether this item renders text or an icon */
    type?: BreadcrumbItemType;
    /** Whether this is the current/active page */
    currentItem?: boolean;
    /** Alias of `currentItem`. */
    isCurrentPage?: boolean;
    /** Accessible name (alias for `aria-label`). */
    accessibilityLabel?: string;
    /** Whether to show the "/" separator after this item */
    showSeparator?: boolean;
    /** Size — controls typography and icon dimensions */
    size?: BreadcrumbSize;
    /** Display text for Text type */
    value?: string;
    /** Icon slot for Icon type (e.g. <Home size={12} />) */
    icon?: ReactNode;
    /** href for navigation (passed to LinkButton) */
    href?: string;
    /** target for anchor (passed to LinkButton) */
    target?: string;
    /** rel for anchor (passed to LinkButton) */
    rel?: string;
    /** Click handler */
    onClick?: React.MouseEventHandler;
    /** Accessible label (especially useful for Icon type) */
    'aria-label'?: string;
}
export declare function BreadcrumbItem({ type, currentItem, isCurrentPage, showSeparator, size, value, icon, href, target, rel, onClick, 'aria-label': ariaLabelProp, accessibilityLabel, className, ...rest }: BreadcrumbItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace BreadcrumbItem {
    var displayName: string;
}
