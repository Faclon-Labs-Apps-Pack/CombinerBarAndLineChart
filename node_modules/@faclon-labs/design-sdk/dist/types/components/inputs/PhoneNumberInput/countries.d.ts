import { type CountryCode } from 'libphonenumber-js';
export type CountryIso = CountryCode;
export interface CountryEntry {
    iso: CountryIso;
    name: string;
    dialCode: string;
    flagEmoji: string;
}
export declare function isoToFlagEmoji(iso: string): string;
export declare function getCountryList(): CountryEntry[];
export declare function getCountryByIso(iso: CountryIso): CountryEntry | undefined;
export declare function filterCountries(list: CountryEntry[], query: string): CountryEntry[];
