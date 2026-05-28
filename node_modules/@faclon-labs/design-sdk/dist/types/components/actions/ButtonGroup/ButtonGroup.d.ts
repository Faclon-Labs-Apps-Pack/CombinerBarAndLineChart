import { type HTMLAttributes, type ReactNode } from 'react';
import type { ButtonColor, ButtonSize, ButtonVariant } from '../Button/Button';
export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Size applied to every child item. Default: `Medium`. */
    size?: ButtonSize;
    /** Visual style applied to every child item. Default: `Primary`. */
    variant?: ButtonVariant;
    /** Semantic color palette applied to every child item. Default: `Primary`. */
    color?: ButtonColor;
    /** Stretches the group and distributes items evenly across its container width. */
    isFullWidth?: boolean;
    /** Disables every child item. */
    isDisabled?: boolean;
    /** `aria-label` applied to the group wrapper when no visible label is present. */
    accessibilityLabel?: string;
    /** Typically `<ButtonGroupItem>` elements. Other nodes pass through untouched. */
    children: ReactNode;
}
export declare const ButtonGroup: import("react").ForwardRefExoticComponent<ButtonGroupProps & import("react").RefAttributes<HTMLDivElement>>;
