export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperSize = 'Medium' | 'Large';
export type StepperColor = 'positive' | 'negative' | 'notice' | 'information' | 'primary' | 'neutral';
export interface StepperContextValue {
    orientation: StepperOrientation;
    size: StepperSize;
    itemsInGroupCount: number;
    totalItemsInParentGroupCount: number;
}
export declare const StepperContext: import("react").Context<StepperContextValue>;
export declare function useStepper(): StepperContextValue;
