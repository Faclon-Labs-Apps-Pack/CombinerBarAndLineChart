import './TimeColumn.css';
export interface TimeColumnProps {
    /** Accessible label for the scroll list (e.g. "Hours") */
    label: string;
    /** Display strings for each row (e.g. ['01', '02', …, '12']) */
    items: readonly string[];
    /** Index of the currently-selected item */
    selectedIndex: number;
    /** Called when the user clicks, key-selects, or scrolls a new row onto the band */
    onSelect: (index: number) => void;
    /** When true, scrolls the selected row under the band on mount and when selectedIndex changes */
    scrollToSelected?: boolean;
    className?: string;
}
export declare const TimeColumn: import("react").ForwardRefExoticComponent<TimeColumnProps & import("react").RefAttributes<HTMLDivElement>>;
