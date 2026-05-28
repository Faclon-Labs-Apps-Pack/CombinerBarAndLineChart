import './TableEditableCell.css';
import { type TdHTMLAttributes } from 'react';
export type EditableCellType = 'text' | 'number' | 'email';
/**
 * When the cell enters edit mode.
 *   - `'click'`    (default) — single click or Enter/Space on the focused
 *                               read-mode cell swaps in the input.
 *   - `'dblclick'` — double-click only. Single click does nothing.
 *   - `'always'`   — legacy behaviour; the TextInput is always mounted.
 */
export type EditableCellMode = 'click' | 'dblclick' | 'always';
export interface TableEditableCellProps<Item = unknown> extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'onChange'> {
    /** Input type routed to the inner `<TextInput>`. Default `'text'`. */
    type?: EditableCellType;
    /** Current value (controlled) or initial value (uncontrolled). */
    value: string;
    /** Optional back-reference to the row item — forwarded verbatim to `onCommit`. */
    item?: Item;
    /** Fired when the user Enters or blurs with a changed value. NOT fired on
     *  every keystroke — that's intentional so consumers don't need to debounce
     *  API writes. */
    onCommit?: (args: {
        value: string;
        item?: Item;
    }) => void;
    /** Placeholder shown when the value is empty. */
    placeholder?: string;
    /** Text shown in read mode when `value` is empty. Default `'—'`. */
    emptyText?: string;
    /** How the cell enters edit mode. Default `'click'`. */
    editMode?: EditableCellMode;
    /** Disables the input. */
    isDisabled?: boolean;
    /** Marks the input visually invalid — also pairs with `errorText` in tooltip UIs. */
    validationState?: 'none' | 'error' | 'success';
    /** Aria-label for the input. Required for a11y since there's no visible label. */
    accessibilityLabel: string;
}
/**
 * TableEditableCell — a cell that shows the value as read-only text by
 * default, then swaps in a DS `<TextInput>` on click / Enter / Space for
 * editing. Matches the Figma "editable cell" pattern where the input chrome
 * only appears while the user is actively editing.
 *
 * **Keyboard support (read mode):** the cell exposes `role="button"` and is
 * focusable with `Tab`. Press `Enter` or `Space` to enter edit mode.
 *
 * **Keyboard support (edit mode):**
 *   - `Enter`  → commit + return to read mode
 *   - `Escape` → revert + return to read mode
 *   - blur     → commit (if value changed) + return to read mode
 *
 * The parent is responsible for persisting `onCommit` to its data source.
 * `editMode="always"` preserves the pre-v0.3.1 always-editable behaviour as
 * an escape hatch.
 */
export declare function TableEditableCell<Item = unknown>({ type, value, item, onCommit, placeholder, emptyText, editMode, isDisabled, validationState, accessibilityLabel, className, style, ...tdProps }: TableEditableCellProps<Item>): import("react/jsx-runtime").JSX.Element;
