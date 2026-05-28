import React, { type MouseEvent } from 'react';
import './DatePickerTrigger.css';
export type DatePickerSelectionType = 'single' | 'range';
export interface DatePickerTriggerProps {
    /** Selection type — single date or date range */
    selectionType?: DatePickerSelectionType;
    /** Label above the field */
    label?: string;
    /** Placeholder text (single mode) */
    placeholder?: string;
    /** Selected date display (single mode: "20/03/2026") */
    date?: string;
    /** Preset label (range mode: "Past 7 days") */
    presetValue?: string;
    /** Date range display (range mode: "13/03/2026 - 19/03/2026") */
    range?: string;
    /** Whether the popover is open */
    isOpen?: boolean;
    /** Whether the field is disabled */
    isDisabled?: boolean;
    /** Help text below the field */
    helpText?: string;
    /** Error text */
    errorText?: string;
    /** Validation state */
    validationState?: 'none' | 'error';
    /** Called when the trigger is clicked */
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    /** Whether to show the preset chip (range mode, default true) */
    showPreset?: boolean;
    /** Called when the preset chip is clicked (range mode — separate from the main field click) */
    onPresetClick?: () => void;
    /** Called when the user types in the single-mode input */
    onInputChange?: (value: string) => void;
    /** Controlled value for the single-mode typed input */
    inputValue?: string;
    /** Called when the single-mode input is focused */
    onInputFocus?: () => void;
    /** Additional class name */
    className?: string;
}
export declare const DatePickerTrigger: React.ForwardRefExoticComponent<DatePickerTriggerProps & React.RefAttributes<HTMLButtonElement>>;
