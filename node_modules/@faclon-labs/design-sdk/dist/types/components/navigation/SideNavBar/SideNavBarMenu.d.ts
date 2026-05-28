import { type ReactNode, type HTMLAttributes } from 'react';
export interface SideNavBarMenuProps extends HTMLAttributes<HTMLUListElement> {
    children: ReactNode;
}
export declare const SideNavBarMenu: import("react").ForwardRefExoticComponent<SideNavBarMenuProps & import("react").RefAttributes<HTMLUListElement>>;
