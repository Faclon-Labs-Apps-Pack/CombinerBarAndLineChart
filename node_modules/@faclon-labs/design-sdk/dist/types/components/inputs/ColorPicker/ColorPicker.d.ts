import type { HTMLAttributes } from 'react';
import type { ColorConfigMode } from './ColorConfig';
import './ColorPicker.css';
export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
    hue?: number;
    saturation?: number;
    brightness?: number;
    opacity?: number;
    r?: number;
    g?: number;
    b?: number;
    hex?: string;
    configMode?: ColorConfigMode;
    onHueChange?: (hue: number) => void;
    onSaturationBrightnessChange?: (s: number, b: number) => void;
    onOpacityChange?: (opacity: number) => void;
    onRgbChange?: (r: number, g: number, b: number) => void;
    onHexChange?: (hex: string) => void;
    onConfigModeChange?: (mode: ColorConfigMode) => void;
    onColorSelect?: (color: string) => void;
    swatches?: string[][];
    selectedColor?: string;
}
export declare function ColorPicker({ hue, saturation, brightness, opacity, r, g, b, hex, configMode, onHueChange, onSaturationBrightnessChange, onOpacityChange, onRgbChange, onHexChange, onConfigModeChange, onColorSelect, swatches, selectedColor, className, ...props }: ColorPickerProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ColorPicker {
    var displayName: string;
}
