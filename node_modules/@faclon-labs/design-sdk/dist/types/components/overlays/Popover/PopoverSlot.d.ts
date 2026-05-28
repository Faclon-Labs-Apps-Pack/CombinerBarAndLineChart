import type { HTMLAttributes, ReactNode } from 'react';
import './PopoverSlot.css';
export interface PopoverSlotProps extends HTMLAttributes<HTMLDivElement> {
    /** Arbitrary consumer content — forms, inputs, images, chips, etc. */
    children: ReactNode;
}
export declare function PopoverSlot({ children, className, ...props }: PopoverSlotProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PopoverSlot {
    var displayName: string;
}
