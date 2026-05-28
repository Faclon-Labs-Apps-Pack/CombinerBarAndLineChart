import type { MouseEvent, ReactNode } from 'react';
export type ToastType = 'Information' | 'Promotional';
export type ToastColor = 'Neutral' | 'Positive' | 'Negative' | 'Notice' | 'Information';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface ToastActionContext {
    event: MouseEvent;
    toastId: string;
}
export interface ToastAction {
    text: string;
    onClick?: (ctx: ToastActionContext) => void;
    isLoading?: boolean;
}
/** The shape consumers pass to `toast.show(...)`. */
export interface ToastShowProps {
    /** Type of toast. Default `'Information'`. */
    type?: ToastType;
    /** Semantic color (Information toasts only). Default `'Neutral'`. */
    color?: ToastColor;
    /** Body content — required. Promotional toasts can use a string or rich nodes. */
    content: ReactNode;
    /** Promotional-only — bold heading above the content. */
    heading?: string;
    /** Custom leading icon. Auto-mapped per `color` when omitted. */
    leading?: ReactNode;
    /** Action button — usually only used in Promotional toasts. */
    action?: ToastAction;
    /** Fires when the dismiss × is clicked (in addition to actually dismissing). */
    onDismissButtonClick?: (ctx: ToastActionContext) => void;
    /** Auto-dismiss after `duration`. Default informational `true`, promotional `false`. */
    autoDismiss?: boolean;
    /** Auto-dismiss timeout in ms. Default informational 4000, promotional 8000. `Infinity` if `autoDismiss=false`. */
    duration?: number;
    /** Stable ID for imperative `dismiss(id)`. Auto-generated if omitted. */
    id?: string;
    /** Render a thin progress bar at bottom showing remaining auto-dismiss time. Default `false`. */
    showProgress?: boolean;
}
/** A live toast in the queue (internal). */
export interface ToastShape extends Required<Pick<ToastShowProps, 'id' | 'type' | 'color' | 'autoDismiss' | 'duration'>> {
    content: ReactNode;
    heading?: string;
    leading?: ReactNode;
    action?: ToastAction;
    onDismissButtonClick?: (ctx: ToastActionContext) => void;
    showProgress: boolean;
    /** Wall-clock ms when this toast was shown. */
    createdAt: number;
    /** Lifecycle flag — false triggers exit animation; toast is removed from state after exit completes. */
    isVisible: boolean;
}
export interface ToastContextValue {
    toasts: ToastShape[];
    show: (props: ToastShowProps) => string;
    dismiss: (id?: string) => void;
}
/** Props for the presentational `<Toast>` (the visual card layer). */
export interface ToastProps {
    type?: ToastType;
    color?: ToastColor;
    content: ReactNode;
    heading?: string;
    leading?: ReactNode;
    action?: ToastAction;
    toastId?: string;
    onDismiss?: (event: MouseEvent) => void;
    showProgress?: boolean;
    duration?: number;
    /** True while the toast is on screen; false triggers slide-out animation. */
    isVisible?: boolean;
    className?: string;
}
