import { type ButtonProps } from '../Button/Button';
export type ButtonGroupItemPosition = 'Left' | 'Center' | 'Right' | 'Only';
export interface ButtonGroupItemProps extends Omit<ButtonProps, 'variant' | 'size' | 'color' | 'isFullWidth' | 'isDisabled'> {
    /**
     * Auto-assigned by `ButtonGroup` based on child index. Only set manually when rendering
     * outside a `ButtonGroup` (rarely useful — a standalone item is just a `Button`).
     */
    position?: ButtonGroupItemPosition;
}
/**
 * A single item in a `ButtonGroup`. Renders a `<span>` wrapper around the composed
 * `Button`. The wrapper owns layout (overlap margin, focus/hover z-index lift) so the
 * inner `Button` keeps its native paint — including its full focus ring, which sits
 * above neighbouring items when focused.
 */
export declare const ButtonGroupItem: import("react").ForwardRefExoticComponent<ButtonGroupItemProps & import("react").RefAttributes<HTMLButtonElement>>;
