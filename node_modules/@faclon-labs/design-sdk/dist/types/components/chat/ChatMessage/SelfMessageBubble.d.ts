import React from 'react';
type SelfMessageBubbleProps = {
    children?: React.ReactNode;
    validationState?: 'error' | 'none';
    errorText?: string;
    isChildText: boolean;
};
declare const SelfMessageBubble: ({ children, validationState, errorText, isChildText, }: SelfMessageBubbleProps) => React.ReactElement;
export { SelfMessageBubble };
