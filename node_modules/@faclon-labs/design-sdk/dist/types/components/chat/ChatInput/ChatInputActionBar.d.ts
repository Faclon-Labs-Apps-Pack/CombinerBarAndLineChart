import React from 'react';
type ChatInputActionBarProps = {
    isDisabled?: boolean;
    isGenerating?: boolean;
    isSubmitDisabled: boolean;
    onUploadClick: () => void;
    onSubmit: () => void;
    onStop?: () => void;
};
declare const ChatInputActionBar: ({ isDisabled, isGenerating, isSubmitDisabled, onUploadClick, onSubmit, onStop, }: ChatInputActionBarProps) => React.ReactElement;
export { ChatInputActionBar };
