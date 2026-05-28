import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './IconButton.css';
export type IconButtonSize = 'Small' | 'Medium' | 'Large';
/** @deprecated numeric size strings are kept for backwards compatibility with internal callers. Use `'Small' | 'Medium' | 'Large'`. */
export type IconButtonLegacySize = '12' | '16' | '20';
export type IconButtonEmphasis = 'Intense' | 'Subtle';
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
    /** Icon element to render */
    icon: ReactNode;
    /** Icon size — Small (12px), Medium (16px), Large (20px). Default `'Medium'`. */
    size?: IconButtonSize | IconButtonLegacySize;
    /** Visual emphasis — `Intense` goes to `--text-gray-primary` on hover (default); `Subtle` goes to `--text-gray-secondary`. */
    emphasis?: IconButtonEmphasis;
    /**
     * Adds a transparent square hit-area that reveals a faint background on hover/focus.
     * Small → 24 px box, Medium → 32 px box. Not supported on Large.
     */
    isHighlighted?: boolean;
    /** Disables interaction. */
    isDisabled?: boolean;
    /** Accessible name (sets `aria-label` on the button). Required for icon-only context. */
    accessibilityLabel?: string;
}
export declare const IconButton: import("react").ForwardRefExoticComponent<IconButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
