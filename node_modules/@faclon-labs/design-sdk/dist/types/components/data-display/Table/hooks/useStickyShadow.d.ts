import { type RefObject } from 'react';
/**
 * Listens to a scroll container's `scrollLeft`. Sets a `data-scrolled` attr
 * on the element and returns the same boolean for context consumption.
 *
 * Phase 6 will use this to render a shadow on the right edge of frozen
 * columns when the table is scrolled horizontally.
 */
export declare function useStickyShadow(ref: RefObject<HTMLElement | null>): boolean;
