import type { HTMLAttributes, ReactNode } from 'react';
import './Indicator.css';
export type IndicatorIntent = 'Positive' | 'Negative' | 'Notice' | 'Information' | 'Neutral' | 'Primary';
export type IndicatorSize = 'Small' | 'Medium' | 'Large';
export type IndicatorEmphasis = 'Subtle' | 'Intense';
export interface IndicatorProps extends HTMLAttributes<HTMLDivElement> {
    /** Semantic color intent */
    intent?: IndicatorIntent;
    /** Dot size — Small 6px, Medium 8px, Large 10px */
    size?: IndicatorSize;
    /** Visual emphasis. `Subtle` (default) renders a single dot; `Intense` adds an outer faded ring. */
    emphasis?: IndicatorEmphasis;
    /** Label text next to the dot. Preferred over `children`. */
    label?: string;
    /** Label content — alternative to `label` for arbitrary nodes. */
    children?: ReactNode;
    /** Accessible name when no `label`/`children` is shown (dot-only mode). */
    accessibilityLabel?: string;
}
export declare function Indicator({ intent, size, emphasis, label, children, accessibilityLabel, className, ...props }: IndicatorProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Indicator {
    var displayName: string;
}
