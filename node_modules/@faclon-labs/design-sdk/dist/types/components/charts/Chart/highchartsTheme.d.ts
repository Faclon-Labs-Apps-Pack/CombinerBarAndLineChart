import type { Options } from 'highcharts';
/**
 * Default Faclon chart series palette — entirely token-driven, sourced
 * exclusively from the SDK's **semantic** color tokens (not global hex
 * tokens). The chart resolves each variable to an actual color at runtime
 * via `getComputedStyle` inside `useFaclonChartTheme()`.
 *
 * Used in source order — series 1 gets the first color, series 2 gets the
 * second, etc. Consumers can override per-series via
 * `<ColumnChart series={[{ color: '#...' }]} />`.
 */
export declare const FACLON_CHART_PALETTE_TOKENS: readonly string[];
/**
 * Read a CSS custom property from `:root`. Returns an empty string on the
 * server (where `window` is undefined) so that the `||` fallback in the
 * theme builder picks up a sane default.
 */
export declare function readCssVar(name: string): string;
/**
 * Build a Highcharts options object themed to match Faclon tokens.
 *
 * Returns a memoized `Highcharts.Options` that contains ONLY the Faclon
 * color + text styling overrides. Each chart-type wrapper merges this with
 * its own type-specific config (`type: 'column'`, series data, etc.) before
 * passing to `<HighchartsReact>`.
 *
 * Uses Faclon semantic color tokens via `getComputedStyle`. Falls back to
 * the literal token value if `window` is unavailable (SSR) or the var is
 * missing.
 */
export declare function useFaclonChartTheme(): Options;
