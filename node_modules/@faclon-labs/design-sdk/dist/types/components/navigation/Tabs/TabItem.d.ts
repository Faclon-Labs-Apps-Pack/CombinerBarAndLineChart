import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './TabItem.css';
export interface TabItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
    /** Unique identifier matching the parent `<Tabs value>` / `defaultValue`. */
    value: string;
    /** Displayed tab label. */
    label: string;
    /** Leading slot — pass `<TabsLeadingItem .../>`. */
    leadingItem?: ReactNode;
    /** Trailing slot — pass `<TabsTrailingItem .../>`. */
    trailing?: ReactNode;
    /** Disables interaction; skipped during arrow-key navigation. */
    isDisabled?: boolean;
}
export declare const TabItem: import("react").ForwardRefExoticComponent<TabItemProps & import("react").RefAttributes<HTMLButtonElement>>;
