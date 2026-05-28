import './TableRowActions.css';
import { type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
export interface TableRowAction {
    /** Stable React key. */
    key: string;
    /** Accessible label — also the dropdown text when this action overflows. */
    label: string;
    /** 16-20 px icon (react-feather convention). Reused as both the inline
     *  IconButton glyph and the `leadingIcon` on the dropdown item. */
    icon: ReactNode;
    onClick: (e: ReactMouseEvent) => void;
    isDestructive?: boolean;
    isDisabled?: boolean;
}
export interface TableRowActionsProps {
    actions: TableRowAction[];
    /** Aria-label for the overflow trigger. Default `'More actions'`. */
    moreAriaLabel?: string;
    /** Dropdown min width in px. Default `OVERFLOW_MENU_MIN_WIDTH`. */
    menuMinWidth?: number;
}
/**
 * TableRowActions — max **3 visible slots** per Figma action column spec.
 *
 *   - `actions.length <= 3` → every action renders inline as a bare IconButton.
 *   - `actions.length > 3`  → first 2 actions inline + a `MoreHorizontal`
 *                             overflow trigger as the 3rd slot. The trigger
 *                             opens a `DropdownMenu` containing actions[2..].
 *
 * The dropdown renders via `createPortal` to `document.body` so it is not
 * clipped by the table's `overflow: auto` scroll container (the same pattern
 * `TablePagination` uses for its size dropdown). Position is computed from
 * the trigger's bounding rect on open + on scroll/resize.
 *
 * Bare IconButtons (not filled Buttons) are intentional here — toolbar-level
 * trailing actions are `<Button iconOnly variant="Gray">`, but **row-level**
 * actions sit against the row bg with no chrome of their own. See
 * `feedback_toolbar_icon_buttons.md` for the full rule.
 *
 * `e.stopPropagation()` is applied on every click so row-level `onClick`
 * handlers don't fire alongside the action click.
 */
export declare function TableRowActions({ actions, moreAriaLabel, menuMinWidth, }: TableRowActionsProps): import("react/jsx-runtime").JSX.Element;
