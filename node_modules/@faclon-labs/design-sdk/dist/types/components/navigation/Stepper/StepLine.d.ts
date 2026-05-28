import type { ReactElement } from 'react';
import './StepLine.css';
export type StepLineStepType = 'single-item' | 'start' | 'middle' | 'end' | 'default';
export type StepLineStepProgress = 'full' | 'start' | 'end' | 'none';
export interface StepLineProps {
    stepType: StepLineStepType;
    shouldShowStartBranch: boolean;
    shouldShowEndBranch: boolean;
    marker?: ReactElement;
    stepProgress: StepLineStepProgress;
}
export declare function StepLine({ stepType, shouldShowStartBranch, shouldShowEndBranch, marker, stepProgress, }: StepLineProps): ReactElement;
export declare namespace StepLine {
    var displayName: string;
}
