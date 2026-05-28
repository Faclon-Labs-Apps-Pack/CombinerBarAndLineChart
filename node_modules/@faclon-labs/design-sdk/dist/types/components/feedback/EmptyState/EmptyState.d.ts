import { type HTMLAttributes, type ReactNode } from 'react';
import './EmptyState.css';
export type EmptyStateSize = 'Medium' | 'Large';
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
    /** Illustration slot. Pass one of the exported illustrations (e.g. <NoDataOneIllustration />)
     *  or any custom ReactNode (img, svg, icon). */
    illustration?: ReactNode;
    /** Main heading — always required */
    title: string;
    /** Muted secondary text below the title */
    description?: string;
    /** Primary action — typically a `<Button variant="Primary">` */
    primaryAction?: ReactNode;
    /** Secondary action — typically a `<Button variant="Secondary">` rendered beside primary */
    secondaryAction?: ReactNode;
    /** Static text before the help link — e.g. "Need help?". Typed as `BodyXSmallRegular`. */
    helpText?: string;
    /** Clickable help link, usually a `<LinkButton>`. Typed as `BodyXSmallMedium`. */
    helpLink?: ReactNode;
    /** Leading icon for the help row. Defaults to react-feather `<Info size={12} />`.
     *  Pass `null` to hide the icon. */
    helpLinkIcon?: ReactNode;
    /** Size variant — Medium (default) or Large. Controls illustration size + title typography. */
    size?: EmptyStateSize;
}
export declare const EmptyState: import("react").ForwardRefExoticComponent<EmptyStateProps & import("react").RefAttributes<HTMLDivElement>>;
