import type { HTMLAttributes } from 'react';
import './ColorConfig.css';
export type ColorConfigMode = 'Hex' | 'RGB';
export interface ColorConfigProps extends HTMLAttributes<HTMLDivElement> {
    mode?: ColorConfigMode;
    hex?: string;
    r?: number;
    g?: number;
    b?: number;
    opacity?: number;
    onModeChange?: (mode: ColorConfigMode) => void;
    onHexChange?: (hex: string) => void;
    onRgbChange?: (r: number, g: number, b: number) => void;
    onOpacityChange?: (opacity: number) => void;
}
export declare function ColorConfig({ mode, hex, r, g, b, opacity, onModeChange, onHexChange, onRgbChange, onOpacityChange, className, ...props }: ColorConfigProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ColorConfig {
    var displayName: string;
}
