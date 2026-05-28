import { type TextInputProps, type TextInputAutoComplete, type TextInputNecessityIndicator } from '../TextInput/TextInput';
import './PasswordInput.css';
/**
 * Allowed `autoComplete` values for a password field. Mirrors Blade's
 * restriction — generic autocomplete types (e.g. `email`, `name`) don't make
 * sense here. Browsers + password managers use these to decide whether to
 * offer autofill for an EXISTING credential or to suggest a NEW one.
 */
export type PasswordInputAutoComplete = Extract<TextInputAutoComplete, 'none' | 'currentPassword' | 'newPassword' | 'oneTimeCode'>;
/**
 * Necessity indicator for PasswordInput. Mirrors Blade — `'optional'` is
 * deliberately excluded; password fields are either required or unmarked
 * (pass `undefined` for no indicator).
 */
export type PasswordInputNecessityIndicator = Extract<TextInputNecessityIndicator, 'required'>;
/**
 * Props for `PasswordInput`. A thin wrapper around `TextInput` that:
 * - Forces `type="password"` (toggles to `"text"` when revealed).
 * - Renders an Eye / EyeOff `IconButton` in TextInput's `trailingIcon` slot.
 * - Hardcodes `autoCapitalize="none"`.
 * - Restricts `autoCompleteSuggestionType` + `necessityIndicator` to
 *   password-appropriate values.
 *
 * Most other behaviour (label, validation, sizes, error/help text, ref
 * forwarding, controlled/uncontrolled value, char counter via `maxCharacters`)
 * is inherited from `TextInput`.
 *
 * `labelPosition='left'` is intentionally NOT exposed (per design direction).
 */
export interface PasswordInputProps extends Omit<TextInputProps, 'type' | 'icon' | 'prefix' | 'suffix' | 'trailingIcon' | 'showClearButton' | 'onClearButtonClicked' | 'autoCompleteSuggestionType' | 'necessityIndicator' | 'labelPosition'> {
    /** Show the eye-toggle reveal button. Default `true`. Hidden when disabled. */
    showRevealButton?: boolean;
    /** Restricted autocomplete hint (`'currentPassword' | 'newPassword' | 'oneTimeCode' | 'none'`). */
    autoCompleteSuggestionType?: PasswordInputAutoComplete;
    /** Asterisk indicator. `'optional'` not allowed for password fields. */
    necessityIndicator?: PasswordInputNecessityIndicator;
}
export declare const PasswordInput: import("react").ForwardRefExoticComponent<PasswordInputProps & import("react").RefAttributes<HTMLInputElement>>;
