import type { CalendarDay, CalendarMonthYear } from './CalendarBase';
/**
 * Generate a calendar grid for the given month/year.
 * Only produces as many rows as needed (typically 5, sometimes 4 or 6).
 * Applies range/selection/currentDate types automatically.
 */
export declare function generateCalendarDays(year: number, month: number, rangeStart?: Date | null, rangeEnd?: Date | null, selectedDate?: Date | null, hoverDate?: Date | null): CalendarDay[][];
/** Generate a 4×3 month grid, marking `selectedMonth` (0-based). */
export declare function generateMonths(selectedMonth?: number): CalendarMonthYear[][];
/** Generate a 4×3 year grid starting from `decadeStart`, marking `selectedYear`. */
export declare function generateYears(decadeStart: number, selectedYear?: number): CalendarMonthYear[][];
/** Map a preset value to a concrete date range. Returns null for 'custom'. */
export declare function getPresetDateRange(presetValue: string): {
    start: Date;
    end: Date;
} | null;
/** Format a Date as DD/MM/YYYY */
export declare function formatDate(date: Date): string;
/**
 * Format a raw keystroke string into DD/MM/YYYY with auto-slashes and clamping.
 * - Strips non-digits, keeps max 8 digits (DDMMYYYY).
 * - Clamps day to 01–31, month to 01–12.
 * - Inserts "/" automatically after the day and month segments fill up.
 */
export declare function formatDateInput(raw: string): string;
/** Parse a DD/MM/YYYY string into a Date. Returns null if the string is incomplete or invalid. */
export declare function parseDateDMY(value: string): Date | null;
/**
 * Format a raw keystroke string into HH:MM (24-hour) with auto-colon and clamping.
 * - Strips non-digits, keeps max 4 digits (HHMM).
 * - Clamps hours to 00–23, minutes to 00–59.
 * - Inserts ":" automatically after the hour segment fills up.
 */
export declare function formatTimeInput(raw: string): string;
/** Parse a HH:MM string and return { hours, minutes } or null if invalid. */
export declare function parseTime(value: string): {
    hours: number;
    minutes: number;
} | null;
/** Format a Date as HH:MM */
export declare function formatTime(date: Date): string;
/** Get the header label for the current view */
export declare function getHeaderLabel(view: 'date' | 'month' | 'year', year: number, month: number, decadeStart: number): string;
