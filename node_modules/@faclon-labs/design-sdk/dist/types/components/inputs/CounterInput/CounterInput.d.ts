import { type InputHTMLAttributes, type ReactNode } from 'react';
import './CounterInput.css';
export type CounterInputValidationState = 'none' | 'error' | 'success';
export type CounterInputNecessityIndicator = 'optional' | 'required';
export interface CounterInputChangeMeta {
    name: string;
    value: number | null;
}
export interface CounterInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'type' | 'prefix' | 'size'> {
    /** Label for the input field */
    label: string;
    /** Indicator next to label */
    necessityIndicator?: CounterInputNecessityIndicator;
    /** Field name for form submissions */
    name?: string;
    /** Controlled numeric value. Use `null` to represent empty. */
    value?: number | null;
    /** Default value for uncontrolled usage */
    defaultValue?: number | null;
    /** Minimum allowed value */
    min?: number;
    /** Maximum allowed value */
    max?: number;
    /** Amount added/removed per button click or arrow key press */
    step?: number;
    /** Placeholder shown when value is empty */
    placeholder?: string;
    /** Help text shown below the field */
    helpText?: string;
    /** Error text shown when validationState is 'error' */
    errorText?: string;
    /** Success text shown when validationState is 'success' */
    successText?: string;
    /** Validation state */
    validationState?: CounterInputValidationState;
    /** Disables the input and both buttons */
    isDisabled?: boolean;
    /** Marks the field as required */
    isRequired?: boolean;
    /** Disables interaction and shows a loading indicator while async work is in progress. */
    isLoading?: boolean;
    /**
     * When true, the user can only adjust the value via the +/- buttons;
     * the input itself is not typeable. Defaults to `false`.
     */
    isReadOnly?: boolean;
    /** Leading icon slot (defaults to none) */
    leadingIcon?: ReactNode;
    /** Short label rendered before the value (e.g. a unit like "px") */
    leadingLabel?: string;
    /** Called when value changes */
    onChange?: (meta: CounterInputChangeMeta) => void;
    /** Called when field receives focus */
    onFocus?: (meta: CounterInputChangeMeta) => void;
    /** Called when field loses focus */
    onBlur?: (meta: CounterInputChangeMeta) => void;
    /** Accessibility label for the decrement button */
    decrementLabel?: string;
    /** Accessibility label for the increment button */
    incrementLabel?: string;
}
export declare const CounterInput: import("react").ForwardRefExoticComponent<CounterInputProps & import("react").RefAttributes<HTMLInputElement>>;
