import './CellButtons.css';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
export interface CellButton {
    label: string;
    onClick: (e: ReactMouseEvent) => void;
    leadingIcon?: ReactNode;
    isDisabled?: boolean;
    isLoading?: boolean;
}
export interface CellButtonsProps {
    /** Primary action — rendered on the right (button order: secondary, primary). */
    primary?: CellButton;
    /** Secondary action — rendered to the left of primary (if both present). */
    secondary?: CellButton;
    className?: string;
}
/**
 * CellButtons — up to two XSmall Buttons, right-aligned.
 * Drop inside `<TableCell contentType="buttons">`. Maps to Figma node
 * 1313:12938. Primary = DS `Primary` variant, Secondary = DS `Gray`
 * variant (matches Figma's gray-bg filled-outline secondary). Both use
 * `size="XSmall"` (28 px tall) to fit the 40 px row.
 */
export declare function CellButtons({ primary, secondary, className }: CellButtonsProps): import("react/jsx-runtime").JSX.Element;
