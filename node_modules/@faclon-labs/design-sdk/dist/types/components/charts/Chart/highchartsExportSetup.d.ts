/**
 * Initialise the Highcharts `exporting` and `export-data` modules exactly
 * once. Safe to call from any chart wrapper on every render — subsequent
 * calls are a no-op.
 *
 * Order matters: `exporting` must register before `export-data`.
 *
 * `offline-exporting` is intentionally NOT loaded — per the v12.3+ docs it
 * is only required for PDF export, which the SDK does not expose. PNG /
 * JPEG / SVG are handled locally by the `exporting` module by default.
 *
 * SSR-safe: returns early when `window` is undefined.
 */
export declare function ensureHighchartsExport(): void;
