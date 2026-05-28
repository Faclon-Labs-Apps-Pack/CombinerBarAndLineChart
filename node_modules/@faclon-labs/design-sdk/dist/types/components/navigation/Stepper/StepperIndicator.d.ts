import { type HTMLAttributes } from 'react';
import type { StepperColor, StepperSize } from './StepperContext';
import './StepperIndicator.css';
export interface StepperIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    color?: StepperColor;
    /** Visual scale. Forwarded by `<StepperStep>` from the parent `<Stepper>`. */
    size?: StepperSize;
    /** Forwarded by `<StepperStep>` when its `isDisabled` is true. */
    isDisabled?: boolean;
}
export declare const StepperIndicator: import("react").ForwardRefExoticComponent<StepperIndicatorProps & import("react").RefAttributes<HTMLDivElement>>;
