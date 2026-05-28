import type { HTMLAttributes } from 'react';
import './ColorCell.css';
export interface ColorCellProps extends HTMLAttributes<HTMLButtonElement> {
    /** Color value (any CSS color string) */
    color: string;
    /** Whether this cell is selected */
    isSelected?: boolean;
}
export declare function ColorCell({ color, isSelected, className, ...props }: ColorCellProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ColorCell {
    var displayName: string;
}
