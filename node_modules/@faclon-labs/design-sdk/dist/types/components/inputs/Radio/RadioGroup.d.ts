import { type ChangeEvent, type HTMLAttributes, type ReactNode } from 'react';
import type { RadioSize } from './Radio';
import './RadioGroup.css';
export type RadioGroupOrientation = 'Vertical' | 'Horizontal';
export type RadioGroupLabelPosition = 'Top' | 'Left';
export type RadioGroupNecessityIndicator = 'Required' | 'Optional' | 'None';
export interface RadioGroupChangeMeta {
    name: string;
    value: string;
    event: ChangeEvent<HTMLInputElement>;
}
interface RadioGroupContextValue {
    name: string;
    value: string;
    onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
    isDisabled: boolean;
    isRequired: boolean;
    size: RadioSize;
}
export declare function useRadioGroupContext(): RadioGroupContextValue | null;
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
    /** Group label */
    label?: string;
    /** Position of the group label relative to the radios */
    labelPosition?: RadioGroupLabelPosition;
    /** Help text shown below the radios */
    helpText?: string;
    /** Marks the group as required — cascades `aria-required` and adjusts `necessityIndicator` */
    isRequired?: boolean;
    /** Visual indicator on the label */
    necessityIndicator?: RadioGroupNecessityIndicator;
    /** Form `name` shared by all child radios. Auto-generated via `useId()` if omitted. */
    name?: string;
    /** Controlled selected value */
    value?: string;
    /** Default value for uncontrolled usage */
    defaultValue?: string;
    /** Called when selection changes */
    onChange?: (meta: RadioGroupChangeMeta) => void;
    /** Size — controls label typography + cascades to child radios */
    size?: RadioSize;
    /** Disables all radios in the group */
    isDisabled?: boolean;
    /** Radio children */
    children: ReactNode;
    /** Stack radios vertically or horizontally */
    orientation?: RadioGroupOrientation;
}
export declare function RadioGroup({ label, labelPosition, helpText, isRequired, necessityIndicator, name: nameProp, value: controlledValue, defaultValue, onChange, size, isDisabled, children, className, orientation, ...rest }: RadioGroupProps): import("react/jsx-runtime").JSX.Element;
export declare namespace RadioGroup {
    var displayName: string;
}
export {};
