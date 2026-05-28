/** Internal context — lets `PopoverHeader` call the root `close()` without
 *  consumers having to wire state manually. */
export interface PopoverContextValue {
    close: () => void;
}
export declare const PopoverContext: import("react").Context<PopoverContextValue | null>;
/** Reads the close function from context. Returns a no-op outside a Popover. */
export declare function usePopoverContext(): PopoverContextValue;
