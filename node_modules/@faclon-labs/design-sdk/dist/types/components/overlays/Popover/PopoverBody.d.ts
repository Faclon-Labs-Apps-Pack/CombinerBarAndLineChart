import type { HTMLAttributes, ReactNode } from 'react';
import './PopoverBody.css';
export interface PopoverBodyProps extends HTMLAttributes<HTMLDivElement> {
    /** Convenience description — rendered as `BodyMediumRegular` with muted secondary color,
     *  matching the first text line in Figma 778:8023. For anything else use `children`. */
    description?: string;
    /** Custom content slot — rendered below the description with 16 px vertical gap. */
    children?: ReactNode;
}
export declare function PopoverBody({ description, children, className, ...props }: PopoverBodyProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PopoverBody {
    var displayName: string;
}
