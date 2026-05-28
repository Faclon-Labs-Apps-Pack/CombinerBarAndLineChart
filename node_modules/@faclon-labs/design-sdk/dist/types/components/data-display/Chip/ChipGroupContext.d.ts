import type { ChipSize } from './Chip';
export type ChipGroupSelectionType = 'single' | 'multiple';
export interface ChipGroupContextValue {
    selectionType: ChipGroupSelectionType;
    selectedValues: Set<string>;
    onChipToggle: (value: string) => void;
    size: ChipSize;
    isDisabled: boolean;
    name: string;
}
export declare const ChipGroupContext: import("react").Context<ChipGroupContextValue | null>;
/** Optional — returns `null` when a Chip is rendered outside a ChipGroup. */
export declare function useChipGroupContext(): ChipGroupContextValue | null;
