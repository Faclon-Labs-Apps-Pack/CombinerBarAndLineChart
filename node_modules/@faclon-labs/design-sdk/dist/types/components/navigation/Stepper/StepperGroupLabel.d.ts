import type { HTMLAttributes, ReactNode } from 'react';
import './StepperGroupLabel.css';
export interface StepperGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    /** Caption text or nodes rendered in BodySmallSemibold muted tone. */
    children: ReactNode;
}
export declare function StepperGroupLabel({ children, className, ...props }: StepperGroupLabelProps): import("react/jsx-runtime").JSX.Element;
export declare namespace StepperGroupLabel {
    var displayName: string;
}
