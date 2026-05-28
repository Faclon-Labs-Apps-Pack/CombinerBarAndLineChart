import './TabIndicator.css';
/**
 * Sliding selected-tab indicator. Single shared element used by ALL 3 variants:
 * - Bordered/Borderless: thin line at the bottom (horizontal) / left (vertical) edge.
 * - Filled: full-size pill that slides between tabs (matches Blade's segmented control).
 *
 * Measures the selected tab via context's `getItemEl`, applies position +
 * size inline, and re-measures on tablist resize via ResizeObserver.
 */
export declare function TabIndicator(): import("react/jsx-runtime").JSX.Element;
export declare namespace TabIndicator {
    var displayName: string;
}
