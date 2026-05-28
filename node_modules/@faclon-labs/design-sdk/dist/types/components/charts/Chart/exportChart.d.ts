export type ChartExportFormat = 'PNG' | 'JPEG' | 'SVG' | 'CSV' | 'XLSX';
export type ChartExportEngine = 'highcharts' | 'apex';
export interface ExportChartParams {
    /** Live chart instance — `Highcharts.Chart` or ApexCharts chartContext. */
    instance: unknown;
    /** Which engine produced the instance. */
    engine: ChartExportEngine;
    /** Format to download. */
    format: ChartExportFormat;
    /** Filename prefix (no extension). @default 'chart' */
    fileName?: string;
}
/**
 * Trigger a download of the given chart in the requested format. Returns
 * silently when the instance is missing, the engine doesn't support the
 * format, or the engine's export modules haven't been wired.
 */
export declare function exportChart({ instance, engine, format, fileName, }: ExportChartParams): void;
