import { type HTMLAttributes, type ReactNode } from 'react';
import './Alert.css';
export type AlertColor = 'Positive' | 'Negative' | 'Notice' | 'Information' | 'Neutral';
export type AlertEmphasis = 'Subtle' | 'Intense';
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Bold title — required. */
    title: string;
    /** Body text below the title. */
    description?: ReactNode;
    /** Semantic color family. Default: `Information`. */
    color?: AlertColor;
    /** Visual weight. Default: `Subtle`. */
    emphasis?: AlertEmphasis;
    /** Drives both width AND layout:
     *  - `true`  → full width + stacked (close × top-right, actions below description)
     *  - `false` → compact width + inline (primary/secondary/close × trailing). Default. */
    isFullWidth?: boolean;
    /** Banner mode — removes border-radius for a full-bleed page-top banner.
     *  Typically combined with `isFullWidth`. Default `false`. */
    isBanner?: boolean;
    /** Override the auto-picked icon for the given `color`. */
    icon?: ReactNode;
    /** Primary action — usually a `<Button>`. */
    primaryAction?: ReactNode;
    /** Secondary action — usually a `<LinkButton>`. */
    secondaryAction?: ReactNode;
    /** Renders the close × button. Default: `false`. */
    isDismissible?: boolean;
    /** Fired when the × is clicked. */
    onDismiss?: () => void;
    /** `aria-label` for the close × button. Default: `'Dismiss alert'`. */
    dismissAriaLabel?: string;
}
export declare const Alert: import("react").ForwardRefExoticComponent<AlertProps & import("react").RefAttributes<HTMLDivElement>>;
