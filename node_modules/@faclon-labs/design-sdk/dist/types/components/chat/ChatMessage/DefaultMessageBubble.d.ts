import React from 'react';
import type { ReasoningTrace } from './types';
type DefaultMessageBubbleProps = {
    children?: React.ReactNode;
    leading?: React.ReactNode;
    isLoading?: boolean;
    footerActions?: React.ReactNode;
    isChildText: boolean;
    reasoningTraces?: ReasoningTrace[];
    reasoningStatus?: 'loading' | 'complete';
    reasoningTitle?: string;
    reasoningActiveStepIndex?: number;
};
declare const DefaultMessageBubble: ({ children, leading, isLoading, footerActions, isChildText, reasoningTraces, reasoningStatus, reasoningTitle, reasoningActiveStepIndex, }: DefaultMessageBubbleProps) => React.ReactElement;
export { DefaultMessageBubble };
