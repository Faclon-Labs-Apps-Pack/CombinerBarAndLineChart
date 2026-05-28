import type { HTMLAttributes, ReactNode } from 'react';
import type { DatePresetOption } from './DatePresetSidebar';
import './DatePicker.css';
export type DatePickerMode = 'single' | 'range';
export interface DateRange {
    start: Date;
    end: Date;
}
export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    mode?: DatePickerMode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    value?: Date | null;
    onChange?: (value: Date | null) => void;
    rangeValue?: DateRange | null;
    onRangeChange?: (value: DateRange | null) => void;
    showPresets?: boolean;
    showPresetChip?: boolean;
    presets?: DatePresetOption[];
    selectedPreset?: string;
    onPresetSelect?: (value: string) => void;
    label?: string;
    placeholder?: string;
    helpText?: string;
    errorText?: string;
    validationState?: 'none' | 'error';
    isDisabled?: boolean;
    showPeriodicity?: boolean;
    periodicitySlot?: ReactNode;
}
export declare function DatePicker({ mode, isOpen: controlledOpen, onOpenChange, value, onChange, rangeValue, onRangeChange, showPresets, showPresetChip, presets, selectedPreset: controlledPreset, onPresetSelect: controlledPresetSelect, label, placeholder, helpText, errorText, validationState, isDisabled, showPeriodicity, periodicitySlot, className, ...props }: DatePickerProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DatePicker {
    var displayName: string;
}
