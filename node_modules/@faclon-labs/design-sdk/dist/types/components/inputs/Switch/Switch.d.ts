import { type InputHTMLAttributes, type ChangeEvent } from 'react';
import './Switch.css';
export type SwitchSize = 'Small' | 'Medium';
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'value'> {
    /** Size of the switch. Default `'Medium'`. */
    size?: SwitchSize;
    /** Controlled checked state. */
    isChecked?: boolean;
    /** Initial checked state for uncontrolled usage. */
    defaultChecked?: boolean;
    /** Disables interaction. */
    isDisabled?: boolean;
    /** Field name for form submissions. */
    name?: string;
    /** Form value submitted when the switch is checked. */
    value?: string;
    /** Fires on toggle. Payload mirrors Blade's `OnChange` shape. */
    onChange?: (meta: {
        isChecked: boolean;
        event: ChangeEvent<HTMLInputElement>;
        value?: string;
    }) => void;
    /** Accessible name. Required — Switch has no built-in visible label. */
    accessibilityLabel: string;
    className?: string;
}
export declare const Switch: import("react").ForwardRefExoticComponent<SwitchProps & import("react").RefAttributes<HTMLInputElement>>;
