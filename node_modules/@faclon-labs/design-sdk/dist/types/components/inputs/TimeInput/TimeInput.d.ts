import { type HTMLAttributes } from 'react';
import { type TimeInputTriggerSize } from './TimeInputTrigger';
import './TimeInput.css';
export type TimeInputHourFormat = '12' | '24';
export type TimeInputSize = TimeInputTriggerSize;
export type TimeInputValidationState = 'none' | 'error' | 'success';
export type TimeInputNecessityIndicator = 'optional' | 'required';
export interface TimeInputValue {
    /** 0–23 (canonical 24-hour form regardless of display format) */
    hours: number;
    /** 0–59 */
    minutes: number;
}
export interface TimeInputChangeMeta {
    name: string;
    value: TimeInputValue | null;
}
export interface TimeInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    label: string;
    name?: string;
    value?: TimeInputValue | null;
    defaultValue?: TimeInputValue | null;
    hourFormat?: TimeInputHourFormat;
    size?: TimeInputSize;
    placeholder?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onChange?: (meta: TimeInputChangeMeta) => void;
    helpText?: string;
    errorText?: string;
    successText?: string;
    validationState?: TimeInputValidationState;
    isDisabled?: boolean;
    isRequired?: boolean;
    necessityIndicator?: TimeInputNecessityIndicator;
}
export declare function TimeInput({ label, name, value, defaultValue, hourFormat, size, placeholder, isOpen: controlledOpen, onOpenChange, onChange, helpText, errorText, successText, validationState, isDisabled, isRequired, necessityIndicator, className, id: idProp, ...props }: TimeInputProps): import("react/jsx-runtime").JSX.Element;
export declare namespace TimeInput {
    var displayName: string;
}
