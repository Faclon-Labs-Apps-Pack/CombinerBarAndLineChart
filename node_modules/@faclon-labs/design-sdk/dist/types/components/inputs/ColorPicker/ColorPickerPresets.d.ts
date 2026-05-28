import type { HTMLAttributes } from 'react';
import type { ColorPaletteData } from './ColorPalette';
import './ColorPickerPresets.css';
export declare const DEFAULT_PALETTES: ColorPaletteData[];
export declare const DEFAULT_SWATCHES: string[][];
export interface ColorPickerPresetsProps extends HTMLAttributes<HTMLDivElement> {
    /** Swatch rows to display. Defaults to DEFAULT_SWATCHES (4×7 flat grid). */
    swatches?: string[][];
    /** Currently selected color (hex) */
    selectedColor?: string;
    /** Called when a swatch is clicked */
    onColorSelect?: (color: string) => void;
}
export declare function ColorPickerPresets({ swatches, selectedColor, onColorSelect, className, ...props }: ColorPickerPresetsProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ColorPickerPresets {
    var displayName: string;
}
