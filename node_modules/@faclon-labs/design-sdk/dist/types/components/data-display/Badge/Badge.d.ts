import type { HTMLAttributes, ReactNode } from 'react';
import './Badge.css';
export type BadgeColor = 'Positive' | 'Negative' | 'Notice' | 'Information' | 'Neutral' | 'Primary';
export type BadgeEmphasis = 'Subtle' | 'Intense';
export type BadgeSize = 'Small' | 'Medium' | 'Large';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Semantic color of the badge */
    color?: BadgeColor;
    /** Visual weight — Subtle (tinted bg) or Intense (solid bg) */
    emphasis?: BadgeEmphasis;
    /** Size of the badge */
    size?: BadgeSize;
    /** Badge label text. Preferred over `children`. */
    label?: string;
    /** Badge content — used when `label` is omitted (fallback). */
    children?: ReactNode;
    /** Optional leading icon slot */
    leadingIcon?: ReactNode;
}
export declare function Badge({ color, emphasis, size, label, children, leadingIcon, className, ...props }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Badge {
    var displayName: string;
}
