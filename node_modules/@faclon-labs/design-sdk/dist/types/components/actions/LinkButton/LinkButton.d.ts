import { type HTMLAttributes, type ReactNode } from 'react';
import './LinkButton.css';
export type LinkType = 'Anchor' | 'Action';
export type LinkColor = 'Primary' | 'Neutral' | 'Negative' | 'Positive' | 'Warning' | 'Info';
export type LinkSize = 'Large' | 'Medium' | 'Small' | 'XSmall';
export interface LinkButtonProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
    /** Link variant — Anchor (navigational <a>) or Action (interactive <button>) */
    type?: LinkType;
    /** Semantic color — Primary (brand), Neutral (default text), Negative (destructive), Positive (success), Warning (notice), Info (information) */
    color?: LinkColor;
    /** Size of the link */
    size?: LinkSize;
    /** Link label text */
    label?: string;
    /** Leading icon slot */
    leadingIcon?: ReactNode;
    /** Trailing icon slot */
    trailingIcon?: ReactNode;
    /** Disables interaction (Action type only) */
    isDisabled?: boolean;
    /** Content (alternative to label) */
    children?: ReactNode;
    /** href for Anchor type */
    href?: string;
    /** target for Anchor type */
    target?: string;
    /** rel for Anchor type */
    rel?: string;
    /** Click handler */
    onClick?: React.MouseEventHandler;
    /** Accessible name (sets `aria-label`). Required for icon-only links where no text is shown. */
    accessibilityLabel?: string;
}
export declare const LinkButton: import("react").ForwardRefExoticComponent<LinkButtonProps & import("react").RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;
