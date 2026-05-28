import type { HTMLAttributes, ReactNode } from 'react';
import './PopoverFooter.css';
export interface PopoverFooterProps extends HTMLAttributes<HTMLDivElement> {
    /** Primary action — typically `<Button variant="Primary" size="Small">`. Rendered on the right. */
    primaryAction?: ReactNode;
    /** Secondary action — typically `<Button variant="Gray" size="Small">`. Rendered before primary. */
    secondaryAction?: ReactNode;
    /** Custom content — when present, overrides the primary/secondary slots entirely. */
    children?: ReactNode;
}
export declare function PopoverFooter({ primaryAction, secondaryAction, children, className, ...props }: PopoverFooterProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PopoverFooter {
    var displayName: string;
}
