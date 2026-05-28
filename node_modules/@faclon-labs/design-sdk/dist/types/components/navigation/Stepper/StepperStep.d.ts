import { type CSSProperties, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { type StepLineStepProgress } from './StepLine';
import './StepperStep.css';
export type StepperStepProgress = StepLineStepProgress;
export interface StepperStepProps {
    /** Header title text. */
    title: string;
    /** Optional title colour override. Same Faclon token names used elsewhere. */
    titleColor?: string;
    /** Optional subtitle. */
    description?: string;
    /** Optional timestamp shown below the description (gray-tertiary, non-italic). */
    timestamp?: string;
    /** Connector line state. Default `'none'`. */
    stepProgress?: StepperStepProgress;
    /** Marker JSX slot — `<StepperIndicator>` or `<StepperIcon>`. Defaults to a
     *  neutral indicator. */
    marker?: ReactElement;
    /** Vertical-only. Right-aligned slot in the header — typically a `<Badge>`. */
    trailing?: ReactElement;
    /** Selected highlight. Style hooks land in Step 4. */
    isSelected?: boolean;
    /** Mutes text + suppresses interaction. Forwarded to the marker. */
    isDisabled?: boolean;
    /** Anchor `href` — turns the step into an `<a>`. */
    href?: string;
    /** Anchor `target` — used alongside `href`. */
    target?: string;
    /** Click handler — turns the step into a `<button>`. */
    onClick?: (event: MouseEvent) => void;
    /** Accessible name override. Defaults to `title`. */
    accessibilityLabel?: string;
    /** Children rendered below the header — additional custom content. */
    children?: ReactNode;
    /** @internal — injected by parent <Stepper>. */
    _index?: number;
    /** @internal — injected by parent <Stepper>. Global index across nesting. */
    _totalIndex?: number;
    /** @internal — injected by parent <Stepper>. */
    _nestingLevel?: number;
    className?: string;
    style?: CSSProperties;
}
export declare const StepperStep: import("react").ForwardRefExoticComponent<StepperStepProps & import("react").RefAttributes<HTMLDivElement>>;
