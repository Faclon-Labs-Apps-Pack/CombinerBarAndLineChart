import { type ReactNode, type LiHTMLAttributes } from 'react';
export interface SideNavBarMenuItemProps extends LiHTMLAttributes<HTMLLIElement> {
    children: ReactNode;
}
export declare const SideNavBarMenuItem: import("react").ForwardRefExoticComponent<SideNavBarMenuItemProps & import("react").RefAttributes<HTMLLIElement>>;
