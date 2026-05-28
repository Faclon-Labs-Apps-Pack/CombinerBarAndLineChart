export type Periodicity = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';
export interface TimeBucket {
    /** Inclusive start of this bucket. */
    start: Date;
    /** Exclusive end of this bucket. */
    end: Date;
    /** Human-readable label for axis / tooltip display. */
    label: string;
}
export interface BucketRangeOptions {
    /**
     * When `true` (default), the first and last bucket are trimmed to the exact
     * range boundaries. When `false`, they are expanded outward to the nearest
     * whole-period boundary — useful when the consumer wants every bucket to
     * represent a complete period (e.g. a full calendar month), at the cost of
     * showing data slightly outside the selected range.
     * @default true
     */
    clipping?: boolean;
}
/**
 * Cut a date range into buckets at the given periodicity.
 *
 * With `clipping: true` (default), the first bucket starts at `range.start`
 * and the last bucket ends at `range.end` — boundary buckets may be partial.
 * With `clipping: false`, buckets are aligned to whole-period boundaries so
 * every bucket represents a complete period; the returned range may extend
 * slightly outside the input on both ends.
 *
 * @example
 * bucketRange({ start: new Date('2026-04-15'), end: new Date('2026-04-17') }, 'Daily');
 * // → 3 daily buckets: Apr 15 (full), Apr 16 (full), Apr 17 (full)
 *
 * @example
 * bucketRange({ start: new Date('2026-04-05'), end: new Date('2026-04-20') }, 'Monthly', { clipping: false });
 * // → 1 monthly bucket starting Apr 1 ending May 1 (expanded outward)
 */
export declare function bucketRange(range: {
    start: Date;
    end: Date;
}, periodicity: Periodicity, opts?: BucketRangeOptions): TimeBucket[];
/**
 * Mixed-unit bucketing — greedily splits a range into the largest possible
 * whole-period buckets, cascading from coarsest to finest.
 *
 * @example
 * bucketRangeInexact({ start: …, end: 40 days later });
 * // → [ { 1 month }, { 1 week }, { 3 days } ]
 */
export declare function bucketRangeInexact(range: {
    start: Date;
    end: Date;
}): TimeBucket[];
