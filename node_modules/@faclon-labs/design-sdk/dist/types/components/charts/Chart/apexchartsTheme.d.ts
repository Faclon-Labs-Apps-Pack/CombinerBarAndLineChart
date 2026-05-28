import type { ApexOptions } from 'apexcharts';
/** Faclon chart palette — same tokens used by the Highcharts theme. */
export declare const FACLON_APEX_PALETTE_TOKENS: readonly string[];
/**
 * Build an ApexCharts options object themed to match Faclon tokens.
 *
 * Returns a memoized `ApexOptions` with ONLY Faclon color + text styling.
 * Each gauge wrapper merges this with its type-specific config before
 * passing to `<ReactApexChart>`.
 */
export declare function useFaclonApexTheme(): ApexOptions;
