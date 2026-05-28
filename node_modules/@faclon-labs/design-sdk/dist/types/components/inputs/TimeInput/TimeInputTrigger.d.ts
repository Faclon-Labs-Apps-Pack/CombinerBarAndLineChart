import { type MouseEvent } from 'react';
import './TimeInputTrigger.css';
export type TimeInputTriggerSize = 'Medium' | 'Large';
export type TimeInputTriggerValidationState = 'none' | 'error' | 'success';
export type TimeInputTriggerNecessityIndicator = 'optional' | 'required';
export interface TimeInputTriggerProps {
    label: string;
    name?: string;
    placeholder?: string;
    /** Formatted display value, e.g. "12 : 00 AM" (empty string shows placeholder) */
    displayValue?: string;
    size?: TimeInputTriggerSize;
    isOpen?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
    necessityIndicator?: TimeInputTriggerNecessityIndicator;
    helpText?: string;
    errorText?: string;
    successText?: string;
    validationState?: TimeInputTriggerValidationState;
    onClick?: (e: MouseEvent) => void;
    className?: string;
}
export declare const TimeInputTrigger: import("react").ForwardRefExoticComponent<TimeInputTriggerProps & import("react").RefAttributes<HTMLInputElement>>;
