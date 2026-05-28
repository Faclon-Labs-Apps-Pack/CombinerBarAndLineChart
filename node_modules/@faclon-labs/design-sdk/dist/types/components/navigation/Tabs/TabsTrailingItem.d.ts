import { type HTMLAttributes, type ReactNode } from 'react';
import './TabsTrailingItem.css';
export type TabsTrailingItemType = 'Counter' | 'Badge';
export interface TabsTrailingItemProps extends HTMLAttributes<HTMLSpanElement> {
    /** Slot kind — `Counter` renders a numeric pill, `Badge` renders a consumer-passed `<Badge>`. */
    trailing?: TabsTrailingItemType;
    /** Counter content (number / short string) or `<Badge>` instance. */
    children: ReactNode;
}
export declare const TabsTrailingItem: import("react").ForwardRefExoticComponent<TabsTrailingItemProps & import("react").RefAttributes<HTMLSpanElement>>;
