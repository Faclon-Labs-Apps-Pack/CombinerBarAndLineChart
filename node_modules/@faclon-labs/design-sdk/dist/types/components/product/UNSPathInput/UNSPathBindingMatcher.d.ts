export declare const WRAP_OPEN = "{{";
export declare const WRAP_CLOSE = "}}";
/** True iff `value` is a complete `{{...}}` wrapped path. */
export declare function isMappedBinding(value: string): boolean;
/** True iff `value` starts with `{{` (drill in progress, possibly not closed). */
export declare function isOpenBinding(value: string): boolean;
/** Returns the inner path (without braces) for a complete binding, else null. */
export declare function extractInnerPath(value: string): string | null;
/** Returns the inner text for any open binding (closed or not), else null. */
export declare function extractOpenInner(value: string): string | null;
/** Wrap a slash-joined path into `{{path}}`. */
export declare function wrap(path: string): string;
/** Split a complete mapped value into its segments, or null if not mapped. */
export declare function mappedSegments(value: string): string[] | null;
