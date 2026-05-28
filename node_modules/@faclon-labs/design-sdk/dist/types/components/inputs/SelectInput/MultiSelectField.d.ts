import { type ReactNode, type MouseEvent } from 'react';
export interface SelectInputTag {
    label: string;
    onDismiss?: () => void;
}
export type MultiSelectType = 'multiple' | 'multiple-flex';
export interface MultiSelectFieldProps {
    type?: MultiSelectType;
    label: string;
    name?: string;
    placeholder?: string;
    tags?: SelectInputTag[];
    maxVisibleTags?: number;
    helpText?: string;
    errorText?: string;
    validationState?: 'none' | 'error';
    isDisabled?: boolean;
    isOpen?: boolean;
    isReadOnly?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    onBackspace?: () => void;
    onSubmit?: (value: string) => void;
    leadingIcon?: ReactNode;
    leadingText?: string;
    children?: ReactNode;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    /** Fires when the trailing chevron is clicked. Parent toggles the dropdown. */
    onChevronClick?: () => void;
    className?: string;
}
export declare const MultiSelectField: import("react").ForwardRefExoticComponent<MultiSelectFieldProps & import("react").RefAttributes<HTMLInputElement>>;
