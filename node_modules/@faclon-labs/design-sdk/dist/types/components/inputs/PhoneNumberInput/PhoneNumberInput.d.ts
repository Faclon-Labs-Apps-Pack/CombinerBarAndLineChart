import { type TextInputProps } from '../TextInput/TextInput';
import { type CountryIso } from './countries';
import './PhoneNumberInput.css';
export type { CountryIso } from './countries';
export interface PhoneNumberChangeMeta {
    name: string;
    /** Full E.164 value (e.g. `+919876543210`) or empty string */
    value: string;
    /** Formatted national number as displayed (e.g. `98765 43210`) */
    phoneNumber: string;
    /** Dial code including `+` (e.g. `+91`) */
    dialCode: string;
    /** Current country ISO */
    country: CountryIso;
    /** Whether the current number is a valid phone number for the country */
    isValid: boolean;
}
export interface PhoneNumberCountryChangeMeta {
    country: CountryIso;
    dialCode: string;
}
export interface PhoneNumberInputProps extends Omit<TextInputProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'icon' | 'leadingSlot' | 'maxCharacters' | 'autoCompleteSuggestionType' | 'suffix' | 'trailingIcon'> {
    /** Controlled national number string (digits + formatting, no dial code) */
    value?: string;
    /** Uncontrolled initial national number */
    defaultValue?: string;
    /** Controlled country ISO */
    country?: CountryIso;
    /** Uncontrolled initial country (default 'IN') */
    defaultCountry?: CountryIso;
    /** Fires on every input change */
    onChange?: (meta: PhoneNumberChangeMeta) => void;
    /** Fires when the user picks a different country */
    onCountryChange?: (meta: PhoneNumberCountryChangeMeta) => void;
    /** Show the country selector trigger (flag + dial code). Default true. */
    showCountrySelector?: boolean;
    /** Show the dial code inside the trigger. Default true. */
    showDialCode?: boolean;
    /** Restrict the country list to this set (ISO codes) */
    allowedCountries?: CountryIso[];
}
export declare const PhoneNumberInput: import("react").ForwardRefExoticComponent<PhoneNumberInputProps & import("react").RefAttributes<HTMLInputElement>>;
