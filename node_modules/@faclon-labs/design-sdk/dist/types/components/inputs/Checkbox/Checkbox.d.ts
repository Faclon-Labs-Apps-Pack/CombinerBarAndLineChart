import { type InputHTMLAttributes, type ReactNode } from 'react';
import './Checkbox.css';
export type CheckboxSize = 'Small' | 'Medium' | 'Large';
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'> {
    /** Label text displayed next to the checkbox. Alternatively, pass label as children. */
    label?: ReactNode;
    /** Label as children — alternative to the `label` prop. */
    children?: ReactNode;
    /** Size of the checkbox */
    size?: CheckboxSize;
    /** Whether the checkbox is disabled */
    isDisabled?: boolean;
    /** Whether the checkbox is in the indeterminate (intermediate) state */
    isIndeterminate?: boolean;
    /** Absorbed and discarded — prevents leaking to the DOM when passed by composite parents */
    isChecked?: boolean;
}
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLInputElement>>;
