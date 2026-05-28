import { type ComponentType, type HTMLAttributes } from 'react';
import type { StepperColor, StepperSize } from './StepperContext';
import './StepperIcon.css';
type IconComponent = ComponentType<{
    size?: number | string;
    color?: string;
}>;
export interface StepperIconProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    icon: IconComponent;
    color?: StepperColor;
    /** Visual scale. Forwarded by `<StepperStep>` from the parent `<Stepper>`. */
    size?: StepperSize;
    isDisabled?: boolean;
}
export declare const StepperIcon: import("react").ForwardRefExoticComponent<StepperIconProps & import("react").RefAttributes<HTMLDivElement>>;
export {};
