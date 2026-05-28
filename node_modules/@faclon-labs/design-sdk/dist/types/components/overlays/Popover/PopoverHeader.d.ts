import type { HTMLAttributes, ReactNode } from 'react';
import './PopoverHeader.css';
export type PopoverHeaderLeading = 'None' | 'Icon' | 'Asset';
export interface PopoverHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Title text — rendered as `BodyLargeSemibold` */
    title: string;
    /** Leading slot — a react-feather icon (16px) or a small asset (24×24). Pass `null` to hide. */
    leading?: ReactNode;
    /** When true, renders a close `<IconButton icon={<X/>} />` that triggers the parent Popover's close. */
    showClose?: boolean;
    /** Override the close handler. Defaults to calling `close()` from PopoverContext. */
    onClose?: () => void;
}
export declare function PopoverHeader({ title, leading, showClose, onClose, className, ...props }: PopoverHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PopoverHeader {
    var displayName: string;
}
