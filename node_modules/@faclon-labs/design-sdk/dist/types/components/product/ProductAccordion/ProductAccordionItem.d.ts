import type { ReactNode, HTMLAttributes } from 'react';
import './ProductAccordionItem.css';
export interface ProductAccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Header title */
    title: string;
    /** Subtitle below the title */
    subtitle?: string;
    /** Whether the body is visible */
    isExpanded?: boolean;
    /** Active shows chevron + close; inactive hides action controls */
    isActive?: boolean;
    /** Whether the accordion is disabled */
    isDisabled?: boolean;
    /** Leading item slot — pass PALeadingItem */
    leadingItem?: ReactNode;
    /** Trailing slot inside the heading row — for badges, counter pills, info icons, etc. */
    trailingIcon?: ReactNode;
    /**
     * Customizable icon slot beside the chevron — pass an `<IconButton size="16">`
     * (or any 16 px control) for the canonical look that matches the chevron + close.
     */
    headerAction?: ReactNode;
    /** Called when header is clicked to expand/collapse */
    onToggle?: () => void;
    /** Called when close (X) button is clicked */
    onClose?: () => void;
    /** Body content slot */
    children?: ReactNode;
}
export declare function ProductAccordionItem({ title, subtitle, isExpanded, isActive, isDisabled, leadingItem, trailingIcon, headerAction, onToggle, onClose, children, className, ...props }: ProductAccordionItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ProductAccordionItem {
    var displayName: string;
}
