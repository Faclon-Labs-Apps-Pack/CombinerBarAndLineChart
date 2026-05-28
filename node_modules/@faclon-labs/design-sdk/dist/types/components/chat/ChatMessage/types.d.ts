import type { CSSProperties, ReactNode } from 'react';
export type ThumbnailItem = {
    id?: string;
    url: string;
    alt?: string;
};
export type ResolvedThumbnailItem = {
    id: string;
    url: string;
    alt: string;
    originalIndex: number;
    originalThumbnail: ThumbnailItem;
};
export type ReasoningTrace = {
    label: string;
    completedLabel?: string;
};
export type ReasoningTracesProps = {
    traces: ReasoningTrace[];
    status?: 'loading' | 'complete';
    title?: string;
    activeStepIndex?: number;
};
export type ThumbnailPreviewProps = {
    thumbnails: ThumbnailItem[];
    onThumbnailClick?: () => void;
};
type CommonChatMessageProps = {
    children?: ReactNode;
    senderType?: 'self' | 'other';
    isLoading?: boolean;
    loadingText?: string | string[];
    leading?: ReactNode;
    validationState?: 'error' | 'none';
    errorText?: string;
    onClick?: () => void;
    footerActions?: ReactNode;
    maxWidth?: CSSProperties['maxWidth'];
    wordBreak?: CSSProperties['wordBreak'];
    thumbnails?: ThumbnailItem[];
    onThumbnailClick?: () => void;
    reasoningTraces?: ReasoningTrace[];
    reasoningStatus?: 'loading' | 'complete';
    reasoningTitle?: string;
    reasoningActiveStepIndex?: number;
    testID?: string;
};
export type SelfChatMessageProps = CommonChatMessageProps & {
    senderType?: 'self';
};
export type DefaultChatMessageProps = CommonChatMessageProps & {
    senderType: 'other';
};
export type ChatMessageProps = SelfChatMessageProps | DefaultChatMessageProps;
export {};
