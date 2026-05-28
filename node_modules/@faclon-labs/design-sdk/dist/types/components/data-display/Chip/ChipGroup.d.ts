import { type HTMLAttributes, type ReactNode } from 'react';
import { type InputFieldNecessityIndicator } from '../../forms/InputFieldHeader';
import type { ChipSize } from './Chip';
import { type ChipGroupSelectionType } from './ChipGroupContext';
import './ChipGroup.css';
export type { ChipGroupSelectionType } from './ChipGroupContext';
export type ChipGroupValidationState = 'none' | 'error';
export interface ChipGroupOnChangePayload {
    name: string;
    values: string[];
}
export interface ChipGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Children — typically `<Chip>` elements but any layout is allowed. */
    children: ReactNode;
    /** Selection mode. Default: `single`. */
    selectionType?: ChipGroupSelectionType;
    /** Controlled selection. `string` for single, `string[]` for multiple. */
    value?: string | string[];
    /** Uncontrolled default selection. `string` for single, `string[]` for multiple. */
    defaultValue?: string | string[];
    /** Fired whenever selection changes. Always passes `values` as an array. */
    onChange?: (payload: ChipGroupOnChangePayload) => void;
    /** Auto-generated via `useId` when omitted. */
    name?: string;
    /** Size applied to every child Chip. Default: `Small`. */
    size?: ChipSize;
    /** Disables every child Chip. */
    isDisabled?: boolean;
    /** Marks the group as required — shows asterisk and surfaces an error when the user clears their selection. */
    isRequired?: boolean;
    /** Overrides the inferred necessity indicator (`'required'` if `isRequired`, otherwise `'none'`). */
    necessityIndicator?: InputFieldNecessityIndicator;
    /** Explicit validation state. `'error'` forces the error footer regardless of `isRequired`. */
    validationState?: ChipGroupValidationState;
    /** Group label rendered above the chips. */
    label?: string;
    /** Hint text below the chips. Overridden by `errorText` when in an error state. */
    helpText?: string;
    /** Error message below the chips. Takes precedence over `helpText` when in an error state. */
    errorText?: string;
    /** `aria-label` used when `label` is absent. */
    accessibilityLabel?: string;
}
export declare const ChipGroup: import("react").ForwardRefExoticComponent<ChipGroupProps & import("react").RefAttributes<HTMLDivElement>>;
