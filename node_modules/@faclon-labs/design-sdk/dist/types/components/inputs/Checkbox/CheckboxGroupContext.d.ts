export interface CheckboxGroupContextValue {
    /** Form name propagated to all child inputs */
    name?: string;
    /** When true, all child checkboxes are disabled */
    isDisabled?: boolean;
    /** Set of currently checked values */
    groupValues: Set<string>;
    /** Toggle a value in/out of the checked set */
    toggleValue: (value: string) => void;
    /** Group-level validation state — propagates aria-invalid to children */
    validationState?: 'none' | 'error';
}
export declare const CheckboxGroupContext: import("react").Context<CheckboxGroupContextValue | null>;
export declare function useCheckboxGroupContext(): CheckboxGroupContextValue | null;
