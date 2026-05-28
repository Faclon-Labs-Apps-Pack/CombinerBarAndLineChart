import type { ButtonColor, ButtonSize, ButtonVariant } from '../Button/Button';
export interface ButtonGroupContextValue {
    size: ButtonSize;
    variant: ButtonVariant;
    color: ButtonColor;
    isFullWidth: boolean;
    isDisabled: boolean;
}
export declare const ButtonGroupContext: import("react").Context<ButtonGroupContextValue | null>;
/** Optional — returns `null` when a ButtonGroupItem is rendered outside a ButtonGroup. */
export declare function useButtonGroupContext(): ButtonGroupContextValue | null;
