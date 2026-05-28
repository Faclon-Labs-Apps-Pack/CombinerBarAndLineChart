import { type CountryIso } from './countries';
import './CountrySelector.css';
export interface CountrySelectorProps {
    country: CountryIso;
    onCountryChange: (country: CountryIso) => void;
    allowedCountries?: CountryIso[];
    showDialCode?: boolean;
    size?: 'Medium' | 'Large';
    isDisabled?: boolean;
}
export declare function CountrySelector({ country, onCountryChange, allowedCountries, showDialCode, size, isDisabled, }: CountrySelectorProps): import("react/jsx-runtime").JSX.Element;
export declare namespace CountrySelector {
    var displayName: string;
}
