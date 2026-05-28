import type { HTMLAttributes } from 'react';
import './ProgressBar.css';
export type ProgressBarSize = 'Large' | 'Small';
export type ProgressBarIntent = 'Positive' | 'Negative' | 'Notice' | 'Information' | 'Neutral';
export type ProgressBarType = 'progress' | 'meter';
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
    /** Label text shown above the track */
    label?: string;
    /** Override `aria-label` (defaults to `label`, falls back to `'Progress'`) */
    accessibilityLabel?: string;
    /**
     * Semantic role.
     * - `'progress'` (default) → `role="progressbar"`, supports `isIndeterminate` + pulse, for ongoing tasks.
     * - `'meter'` → `role="meter"`, static gauge for capacity-style values (battery, storage, etc.). No indeterminate.
     */
    type?: ProgressBarType;
    /** Current value (clamped to `[min, max]`) */
    value?: number;
    /** Lower bound (default 0) */
    min?: number;
    /** Upper bound (default 100) */
    max?: number;
    /** Size of the track — Large (4px) or Small (2px) */
    size?: ProgressBarSize;
    /** Color intent of the indicator */
    intent?: ProgressBarIntent;
    /** Whether the progress is indeterminate (animated, no percentage). Ignored when `type='meter'`. */
    isIndeterminate?: boolean;
    /** Whether to show the percentage text (default true, hidden when indeterminate) */
    showPercentage?: boolean;
}
export declare function ProgressBar({ label, accessibilityLabel, type, value, min, max, size, intent, isIndeterminate, showPercentage, className, ...props }: ProgressBarProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ProgressBar {
    var displayName: string;
}
