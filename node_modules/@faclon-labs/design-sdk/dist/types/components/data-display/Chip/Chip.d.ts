import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './Chip.css';
export type ChipSize = 'XSmall' | 'Small' | 'Medium' | 'Large';
export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Label text. Required unless `iconOnly` is true (then used as aria-label). */
    label?: string;
    /** Identifier used by a parent `ChipGroup` to track selection. */
    value?: string;
    /** Size of the chip. Overridden by `ChipGroup`'s `size` when nested. */
    size?: ChipSize;
    /** Standalone presentational selected state — ignored when inside a `ChipGroup`. */
    isSelected?: boolean;
    /** Disables interaction. Overridden by `ChipGroup`'s `isDisabled` when nested. */
    isDisabled?: boolean;
    /** Leading icon slot. When `iconOnly` is true, this icon is the only visual. */
    icon?: ReactNode;
    /** Renders an icon-only chip (square padding). `label` becomes `aria-label`. */
    iconOnly?: boolean;
}
export declare const Chip: import("react").ForwardRefExoticComponent<ChipProps & import("react").RefAttributes<HTMLButtonElement>>;
