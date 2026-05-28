import type { HTMLAttributes, ReactNode } from 'react';
import './CardFooter.css';
export type CardFooterLayout = 'Desktop' | 'Mobile';
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    /** Footer title text */
    title?: string;
    /** Footer subtitle text */
    subtitle?: string;
    /** Primary action slot — pass a Button (Primary variant) */
    primaryAction?: ReactNode;
    /** Secondary action slot — pass a Button (Secondary variant) */
    secondaryAction?: ReactNode;
    /** Show top divider */
    showDivider?: boolean;
    /** Layout — Desktop (inline) or Mobile (stacked full-width buttons) */
    layout?: CardFooterLayout;
}
export declare function CardFooter({ title, subtitle, primaryAction, secondaryAction, showDivider, layout, className, ...rest }: CardFooterProps): import("react/jsx-runtime").JSX.Element;
export declare namespace CardFooter {
    var displayName: string;
}
