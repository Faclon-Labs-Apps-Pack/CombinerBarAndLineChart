import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { type StepperOrientation, type StepperSize } from './StepperContext';
import './Stepper.css';
export type { StepperOrientation, StepperSize } from './StepperContext';
export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
    /** `<StepperStep>` children. For nesting, render a nested `<Stepper>` as a
     *  SIBLING of the StepperStep items (not inside one of them). The flattener
     *  walks siblings to build the curved connector between parent and nested
     *  groups — Blade's StepGroup model verbatim. */
    children: ReactNode;
    /** Flow direction. Default `'vertical'`. */
    orientation?: StepperOrientation;
    /** Visual scale. `'Medium'` = 20 px marker (default), `'Large'` = 24 px. */
    size?: StepperSize;
    /** Fixed/flex width of the stepper root. Accepts CSS lengths (e.g. `'480px'`,
     *  `'100%'`) or pixel numbers. Box-prop parity with Blade StepGroup. */
    width?: CSSProperties['width'];
    /** Minimum width of the stepper root. */
    minWidth?: CSSProperties['minWidth'];
    /** Maximum width of the stepper root. */
    maxWidth?: CSSProperties['maxWidth'];
    /** @internal — set by parent Stepper when this is a nested group. */
    _nestingLevel?: number;
}
export declare const Stepper: import("react").ForwardRefExoticComponent<StepperProps & import("react").RefAttributes<HTMLDivElement>>;
