import { type ReactNode, type HTMLAttributes } from 'react';
import { type SelectInputTag } from '../SelectInput/MultiSelectField';
import './SearchInput.css';
export type SearchInputType = 'single' | 'multiple' | 'multiple-flex';
export type SearchInputTag = SelectInputTag;
/**
 * Imperative handle exposed via `ref` on `<SearchInput>`. Replaces the raw
 * `HTMLInputElement` ref that earlier revisions forwarded — consumers now
 * get typed methods instead of the native DOM node so multi-mode (which
 * wraps the input in chip chrome) still exposes the same API.
 */
export interface SearchInputHandle {
    focus: () => void;
    blur: () => void;
    /** Empties the search text. Chips in multi-mode are consumer-owned and
     *  remain untouched — use your own state handler to clear them. */
    clear: () => void;
}
export interface SearchInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'onFocus' | 'onBlur' | 'onSubmit'> {
    type?: SearchInputType;
    label?: string;
    name?: string;
    placeholder?: string;
    /** Controlled input value. Omit + set `defaultValue` for uncontrolled mode. */
    inputValue?: string;
    /** Uncontrolled default. Dev-errors if combined with `inputValue`. */
    defaultValue?: string;
    onInputChange?: (value: string) => void;
    helpText?: string;
    errorText?: string;
    validationState?: 'none' | 'error';
    isDisabled?: boolean;
    isRequired?: boolean;
    /** Controlled open state. Omit for uncontrolled (opens on focus, closes on outside click/Escape). */
    isOpen?: boolean;
    /** Called when the component wants to change open state. */
    onOpenChange?: (open: boolean) => void;
    icon?: ReactNode;
    prefix?: string;
    children?: ReactNode;
    onFocus?: () => void;
    onBlur?: () => void;
    tags?: SearchInputTag[];
    maxVisibleTags?: number;
    onBackspace?: () => void;
    /** Enter key in `type='single'` (when focus is on the input, not a
     *  menuitem) or MultiSelectField's internal Enter submit both route here. */
    onSubmit?: (value: string) => void;
    noResultsText?: string;
    /** Show a clear button when the input has a value. `type='single'` only —
     *  multi-mode chips are dismissed individually via the chip X. */
    showClearButton?: boolean;
    /** Fires when the clear button is pressed. SearchInput also empties the
     *  value (uncontrolled) and refocuses the inner input. */
    onClearButtonClicked?: () => void;
    /** Swaps the clear button for a Spinner. `type='single'` only. */
    isLoading?: boolean;
    /** Field size — Medium (36 px, default) or Large (48 px). */
    size?: 'Medium' | 'Large';
    /** Whether to render the leading search icon. Default `true`. */
    showSearchIcon?: boolean;
    /** Accessible name when no visible `label` is shown. */
    accessibilityLabel?: string;
}
export declare const SearchInput: import("react").ForwardRefExoticComponent<SearchInputProps & import("react").RefAttributes<SearchInputHandle>>;
