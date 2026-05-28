import { type ReactNode, type RefObject } from 'react';
import { DrawerHeader } from './DrawerHeader';
import { DrawerBody } from './DrawerBody';
import { DrawerFooter } from './DrawerFooter';
import './Drawer.css';
export interface DrawerProps {
    /** Controlled visibility. */
    isOpen: boolean;
    /** Fires on backdrop click, Escape, or close-button click. Synchronous. */
    onDismiss: () => void;
    /** Fires AFTER exit animation completes and the panel unmounts. */
    onUnmount?: () => void;
    /** Drawer composition — <DrawerHeader>, <DrawerBody>, <DrawerFooter>. */
    children?: ReactNode;
    /** Render the backdrop. When false, backdrop-click cannot dismiss. @default true */
    showOverlay?: boolean;
    /** Defer mounting body children until isOpen flips true. @default true */
    isLazy?: boolean;
    /** Accessible label on the dialog element. */
    accessibilityLabel?: string;
    /** Element to focus on open. Defaults to the close button. */
    initialFocusRef?: RefObject<HTMLElement | null>;
    /** Base z-index. Stacked drawers add their level. @default --fds-z-modal */
    zIndex?: number;
    /** data-testid passthrough. */
    testID?: string;
}
export declare const Drawer: import("react").ForwardRefExoticComponent<DrawerProps & import("react").RefAttributes<HTMLDivElement>>;
export { DrawerHeader, DrawerBody, DrawerFooter };
