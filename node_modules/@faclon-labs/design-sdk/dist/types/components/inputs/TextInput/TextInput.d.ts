import { type InputHTMLAttributes, type ReactNode } from 'react';
import './TextInput.css';
export type TextInputType = 'text' | 'search' | 'telephone' | 'email' | 'url' | 'number' | 'password';
export type TextInputValidationState = 'none' | 'error' | 'success';
export type TextInputNecessityIndicator = 'optional' | 'required';
export type TextInputLabelPosition = 'top' | 'left';
export type TextInputSize = 'Medium' | 'Large';
export type TextInputAutoComplete = 'currentPassword' | 'newPassword' | 'oneTimeCode' | 'name' | 'email' | 'countryName' | 'postalCode' | 'telephone' | 'username' | 'none';
export type TextInputKeyboardReturn = 'default' | 'go' | 'done' | 'next' | 'search' | 'send';
export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type' | 'onChange' | 'onBlur' | 'onFocus'> {
    /** Label for the input field */
    label: string;
    /** Field size — Medium: 36px/14px text/16px icons (default); Large: 48px/16px text/20px icons. For Large, pass a 20px icon (e.g. `<Search size={20} />`). */
    size?: TextInputSize;
    /** Position of the label */
    labelPosition?: TextInputLabelPosition;
    /** Indicator next to label */
    necessityIndicator?: TextInputNecessityIndicator;
    /** Field name for form submissions */
    name?: string;
    /** Input type */
    type?: TextInputType;
    /** Placeholder text */
    placeholder?: string;
    /** Controlled value */
    value?: string;
    /** Default value for uncontrolled usage */
    defaultValue?: string;
    /** Validation state */
    validationState?: TextInputValidationState;
    /** Help text shown below the field */
    helpText?: string;
    /** Error text shown when validationState is 'error' */
    errorText?: string;
    /** Success text shown when validationState is 'success' */
    successText?: string;
    /** Called when value changes */
    onChange?: (meta: {
        name: string;
        value: string;
    }) => void;
    /** Called when field receives focus */
    onFocus?: (meta: {
        name: string;
        value: string;
    }) => void;
    /** Called when field loses focus */
    onBlur?: (meta: {
        name: string;
        value: string;
    }) => void;
    /** Disables the input */
    isDisabled?: boolean;
    /** Marks the field as required */
    isRequired?: boolean;
    /** Icon displayed at the start of the field */
    icon?: ReactNode;
    /** Interactive element rendered at the start of the field (before input), flush
     *  to the left edge with a right separator. Used by composite inputs such as
     *  PhoneNumberInput for an inline country selector. When provided, `icon` and
     *  `prefix` are ignored. */
    leadingSlot?: ReactNode;
    /** Show clear button */
    showClearButton?: boolean;
    /** Callback when clear button is clicked */
    onClearButtonClicked?: () => void;
    /** Prefix string */
    prefix?: string;
    /** Suffix string */
    suffix?: string;
    /** Trailing slot for arbitrary actions (e.g. PasswordInput's reveal toggle).
     *  Renders inside the trailing row alongside `suffix`/clear/spinner. */
    trailingIcon?: ReactNode;
    /** Shows a loading spinner */
    isLoading?: boolean;
    /** Max character count */
    maxCharacters?: number;
    /** Auto focus on mount */
    autoFocus?: boolean;
    /** Autocomplete hint */
    autoCompleteSuggestionType?: TextInputAutoComplete;
    /** Return key type */
    keyboardReturnKeyType?: TextInputKeyboardReturn;
    /** Accessible name for the input. Sets `aria-label` — use when no visible `label` is shown. */
    accessibilityLabel?: string;
}
export declare const TextInput: import("react").ForwardRefExoticComponent<TextInputProps & import("react").RefAttributes<HTMLInputElement>>;
