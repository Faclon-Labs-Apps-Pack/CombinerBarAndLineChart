import type { HTMLAttributes } from 'react';
import './ColorInput.css';
export interface ColorInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    label?: string;
    value?: string;
    onChange?: (hex: string) => void;
    placeholder?: string;
    helpText?: string;
    errorText?: string;
    validationState?: 'none' | 'error';
    isDisabled?: boolean;
    /** Custom preset swatch rows (4×7 flat grid). Defaults to DS color palette swatches. */
    swatches?: string[][];
}
export declare const ColorInput: import("react").ForwardRefExoticComponent<ColorInputProps & import("react").RefAttributes<HTMLInputElement>>;
