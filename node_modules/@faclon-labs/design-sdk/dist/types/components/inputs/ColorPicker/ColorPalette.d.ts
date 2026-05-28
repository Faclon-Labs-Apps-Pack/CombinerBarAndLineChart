import type { HTMLAttributes } from 'react';
import './ColorPalette.css';
export interface ColorPaletteData {
    name: string;
    colors: string[];
}
export interface ColorPaletteProps extends HTMLAttributes<HTMLDivElement> {
    /** Palette label */
    name: string;
    /** Array of color hex strings */
    colors: string[];
    /** Currently selected color */
    selectedColor?: string;
    /** Called when a color cell is clicked */
    onColorSelect?: (color: string) => void;
}
export declare function ColorPalette({ name, colors, selectedColor, onColorSelect, className, ...props }: ColorPaletteProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ColorPalette {
    var displayName: string;
}
