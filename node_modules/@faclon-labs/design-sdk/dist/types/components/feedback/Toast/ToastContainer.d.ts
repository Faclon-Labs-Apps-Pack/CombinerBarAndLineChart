import { type ReactNode } from 'react';
import type { ToastContextValue, ToastPosition } from './types';
import './Toast.css';
export declare const ToastContext: import("react").Context<ToastContextValue | null>;
export interface ToastContainerProps {
    /** Where on the viewport the stack anchors. Default `'bottom-left'`. */
    position?: ToastPosition;
    /** Override z-index. Default 2001 (above Modal at 2000). */
    zIndex?: number;
    /** Distance from the anchored edge in px. Default 24. */
    offset?: number;
    /** Children — usually your app tree (so `useToast()` resolves through context). */
    children?: ReactNode;
}
export declare function ToastContainer({ position, zIndex, offset, children, }: ToastContainerProps): import("react/jsx-runtime").JSX.Element;
