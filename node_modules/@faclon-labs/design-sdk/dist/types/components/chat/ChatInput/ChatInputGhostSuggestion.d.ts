import React from 'react';
type ChatInputGhostSuggestionProps = {
    suggestions: string[];
    activeSuggestionIndex: number;
    isVisible: boolean;
};
declare const ChatInputGhostSuggestion: ({ suggestions, activeSuggestionIndex, isVisible, }: ChatInputGhostSuggestionProps) => React.ReactElement | null;
export { ChatInputGhostSuggestion };
