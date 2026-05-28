import { type RefObject } from 'react';
export interface DropdownPos {
    top: number;
    left: number;
    width: number;
    placement: 'below' | 'above';
}
/**
 * Shared portal-positioning hook for all dropdown panels.
 * Returns a ref for the portal element and its fixed-position coordinates.
 * Wires click-outside (ignoring the trigger) and scroll/resize dismiss.
 * Two-pass positioning: opens below by default, flips above when the portal
 * clips the bottom viewport edge and there is more space above the trigger.
 */
export declare function useDropdownPortal(triggerRef: RefObject<HTMLElement | null>, open: boolean, onClose: () => void, gap?: number): {
    portalRef: RefObject<HTMLDivElement>;
    pos: DropdownPos | null;
};
