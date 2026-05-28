import { type ReactNode } from 'react';
export type AccordionMode = 'single' | 'multiple';
export interface AccordionProps {
    /** Expand behaviour — 'single' closes others, 'multiple' keeps all open */
    mode?: AccordionMode;
    /** Initially expanded item keys (uncontrolled) */
    defaultExpandedKeys?: string[];
    /** Controlled set of expanded item keys */
    expandedKeys?: string[];
    /** Called when the expanded set changes (controlled + uncontrolled) */
    onExpandChange?: (keys: string[]) => void;
    /** Accordion item children */
    children: ReactNode;
    /** Additional class name */
    className?: string;
}
interface AccordionContextValue {
    expandedKeys: Set<string>;
    toggleKey: (key: string) => void;
}
export declare function useAccordionContext(): AccordionContextValue | null;
export declare function Accordion({ mode, defaultExpandedKeys, expandedKeys: controlledKeys, onExpandChange, children, className, }: AccordionProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Accordion {
    var displayName: string;
}
export {};
