import type { FocusEvent } from 'react';
export type ChatInputFile = File & {
    id?: string;
};
export type ChatInputFileList = ChatInputFile[];
export interface ChatInputProps {
    value?: string;
    defaultValue?: string;
    onChange?: (args: {
        value: string;
    }) => void;
    onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
    onSubmit?: (args: {
        value: string;
        files: ChatInputFileList;
    }) => void;
    placeholder?: string;
    isDisabled?: boolean;
    isGenerating?: boolean;
    onStop?: () => void;
    accept?: string;
    onFileChange?: (args: {
        files: ChatInputFileList;
    }) => void;
    suggestions?: string[];
    onSuggestionAccept?: (args: {
        suggestion: string;
    }) => void;
    validationState?: 'error' | 'none';
    errorText?: string;
    onErrorDismiss?: () => void;
    accessibilityLabel?: string;
    testID?: string;
}
