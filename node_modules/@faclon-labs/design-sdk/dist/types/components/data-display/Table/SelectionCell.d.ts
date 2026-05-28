import type { Identifier } from './types';
export interface SelectionCellProps {
    item: {
        id: Identifier;
        [key: string]: unknown;
    };
    isSelected: boolean;
    isDisabled: boolean;
}
/**
 * Selection cell — auto-injected by `<TableRow>` when the parent Table has
 * `selectionType="multiple"`.
 *
 * Click flow (no double-toggle, no readOnly hack):
 *   - Wrapper `onClick` only stops propagation so row's onClick (open-detail)
 *     doesn't fire alongside selection.
 *   - Plain click on checkbox → native toggle → `onChange` → toggleRowSelection.
 *   - Shift-click on checkbox → `onClick` runs first; `preventDefault` stops
 *     the native toggle (which suppresses `onChange`); we call
 *     `toggleRowSelectionRange` instead.
 *   - Keyboard space on focused checkbox → `onChange` → toggleRowSelection
 *     (no shift semantics from keyboard).
 */
export declare function SelectionCell({ item, isSelected, isDisabled }: SelectionCellProps): import("react/jsx-runtime").JSX.Element | null;
