export type TabsVariant = 'Bordered' | 'Borderless' | 'Filled';
export type TabsSize = 'Medium' | 'Large';
export type TabsOrientation = 'Horizontal' | 'Vertical';
export interface TabsContextValue {
    /** Currently-selected tab `value` (or undefined if nothing selected yet). */
    selectedValue: string | undefined;
    /** Sets the selected tab. */
    setSelectedValue: (value: string) => void;
    variant: TabsVariant;
    size: TabsSize;
    orientation: TabsOrientation;
    /** Horizontal-only — vertical TabItems always fill width. */
    isFullWidthTabItem: boolean;
    /** Stable id prefix for ARIA wiring. */
    baseId: string;
    /** Registers a TabItem ref for keyboard navigation. */
    registerItem: (value: string, el: HTMLButtonElement | null) => void;
    /** Looks up a TabItem button element by `value`. Used by TabIndicator
     *  to measure the selected tab without going through React state. */
    getItemEl: (value: string) => HTMLButtonElement | undefined;
    /**
     * Fallback `value` that should hold `tabIndex={0}` when nothing is selected
     * (e.g. neither `value` nor `defaultValue` was passed). Computed by Tabs as
     * the first non-disabled child TabItem so keyboard users can always Tab into
     * the tablist.
     */
    firstFocusableValue: string | undefined;
}
export declare const TabsContext: import("react").Context<TabsContextValue | null>;
export declare function useTabsContext(): TabsContextValue;
