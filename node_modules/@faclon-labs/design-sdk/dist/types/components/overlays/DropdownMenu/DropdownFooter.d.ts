import type { HTMLAttributes, ReactNode } from 'react';
import './DropdownFooter.css';
export type DropdownFooterStacking = 'Horizontal' | 'Vertical';
export interface DropdownFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Primary action slot — pass a Button (Primary variant, fullWidth) */
    primaryAction?: ReactNode;
    /** Secondary action slot — pass a Button (Secondary variant, fullWidth) */
    secondaryAction?: ReactNode;
    /** Optional custom content slot above/beside actions */
    children?: ReactNode;
    /** Action layout — Horizontal (side by side) or Vertical (stacked full width) */
    stacking?: DropdownFooterStacking;
}
export declare function DropdownFooter({ primaryAction, secondaryAction, children, stacking, className, ...rest }: DropdownFooterProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DropdownFooter {
    var displayName: string;
}
