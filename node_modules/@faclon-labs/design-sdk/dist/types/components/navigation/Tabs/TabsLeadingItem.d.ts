import { type HTMLAttributes, type ReactNode } from 'react';
import './TabsLeadingItem.css';
export type TabsLeadingItemType = 'Icon' | 'Asset';
export type TabsLeadingItemSize = '16' | '20';
export interface TabsLeadingItemProps extends HTMLAttributes<HTMLSpanElement> {
    /** Slot kind — `Icon` for react-feather icons, `Asset` for arbitrary children (image, custom SVG). */
    leading?: TabsLeadingItemType;
    /** Square dimension in pixels. Aligns with TabItem size: Medium → 16, Large → 20. */
    size?: TabsLeadingItemSize;
    /** Icon node, used when `leading="Icon"`. */
    icon?: ReactNode;
    /** Custom asset node, used when `leading="Asset"`. */
    children?: ReactNode;
}
export declare const TabsLeadingItem: import("react").ForwardRefExoticComponent<TabsLeadingItemProps & import("react").RefAttributes<HTMLSpanElement>>;
