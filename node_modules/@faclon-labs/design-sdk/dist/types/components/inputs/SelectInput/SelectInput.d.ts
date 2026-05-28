import { type ReactNode, type MouseEvent } from 'react';
import { type SelectInputTag, type MultiSelectType } from './MultiSelectField';
import './SelectInput.css';
export type { SelectInputTag, MultiSelectType };
export interface SelectInputProps {
    /** Multi-select layout — 'multiple' (fixed height) or 'multiple-flex' (wrapping tags). Omit for single. */
    multiType?: MultiSelectType;
    /** Label for the select field */
    label: string;
    /** Field name for form submissions */
    name?: string;
    /** Placeholder text when no value is selected */
    placeholder?: string;
    /** Display value — for single select, the selected option text */
    value?: string;
    /** Tags — for multi select, array of selected items shown as Tag chips. Presence switches the component into multi mode. */
    tags?: SelectInputTag[];
    /** Max visible tags before showing "+N more" — only applies to multiType="multiple" (default 2) */
    maxVisibleTags?: number;
    /** Help text shown below the field */
    helpText?: string;
    /** Error text — shown when validationState is 'error' */
    errorText?: string;
    /** Validation state */
    validationState?: 'none' | 'error';
    /** Whether the field is disabled */
    isDisabled?: boolean;
    /** When true, single-mode input is typeable and focus opens the dropdown (autocomplete behavior). Ignored in multi mode (multi is always typeable). */
    searchable?: boolean;
    /** Controlled filter text. In single+searchable and multi modes this drives the input's visible value. */
    inputValue?: string;
    /** Fires when the user types in the filter input. */
    onInputChange?: (value: string) => void;
    /** Controlled open state. Omit to use uncontrolled state (click-to-toggle in non-searchable, focus-to-open in searchable). */
    isOpen?: boolean;
    /** Called when dropdown should open/close */
    onOpenChange?: (open: boolean) => void;
    /** Leading icon slot — 16px icon before the value */
    leadingIcon?: ReactNode;
    /** Leading text — prefix text (e.g. currency symbol) */
    leadingText?: string;
    /** Multi mode: called on Backspace in an empty input (remove last tag) */
    onBackspace?: () => void;
    /** Dropdown content — pass DropdownMenu here */
    children?: ReactNode;
    /** Legacy click handler — prefer onOpenChange */
    onClick?: (e: MouseEvent) => void;
    /** Additional class name */
    className?: string;
}
export declare const SelectInput: import("react").ForwardRefExoticComponent<SelectInputProps & import("react").RefAttributes<HTMLInputElement>>;
