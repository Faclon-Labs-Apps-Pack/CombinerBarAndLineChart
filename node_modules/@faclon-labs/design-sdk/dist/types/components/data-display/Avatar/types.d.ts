import type { ComponentType, ImgHTMLAttributes, MouseEvent, ReactElement, ReactNode } from 'react';
import type { IndicatorProps } from '../Indicator/Indicator';
export type AvatarSize = 'XSmall' | 'Small' | 'Medium' | 'Large' | 'XLarge';
export type AvatarVariant = 'Circle' | 'Square';
export type AvatarColor = 'Primary' | 'Positive' | 'Negative' | 'Neutral' | 'Notice' | 'Information';
export type AvatarIconComponent = ComponentType<{
    size?: number | string;
    color?: string;
}>;
export interface AvatarProps {
    /** Visual scale. Default `'Medium'`. */
    size?: AvatarSize;
    /** Shape — `'Circle'` (default) or `'Square'`. */
    variant?: AvatarVariant;
    /** Semantic colour family for the bg + initials text. Default `'Neutral'`. */
    color?: AvatarColor;
    /** Image URL. Has priority over `name` and `icon`. */
    src?: string;
    /** Image `alt` text. Falls back to `name` if omitted. Required for SR support when `src` is provided. */
    alt?: string;
    /** Responsive image srcset. */
    srcSet?: string;
    /** CORS hint for the image element. */
    crossOrigin?: ImgHTMLAttributes<HTMLImageElement>['crossOrigin'];
    /** Referrer policy for the image element. */
    referrerPolicy?: ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];
    /** Display name — used for the initials text fallback (e.g. "Nitin Kumar" → "NK"). */
    name?: string;
    /** Icon rendered when neither `src` nor `name` is provided (or when both fail to resolve). */
    icon?: AvatarIconComponent;
    /** Anchor href — turns the avatar into an `<a>`. */
    href?: string;
    /** `target` for the `<a>` (only honoured with `href`). */
    target?: string;
    /** `rel` for the `<a>` (only honoured with `href`). */
    rel?: string;
    /** Click handler — turns the avatar into a `<button>`. */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /** Persistent selected highlight (thick brand border). */
    isSelected?: boolean;
    /**
     * Top-right addon. **Must be an `<Indicator>` element.** Avatar injects the
     * correct indicator size from the current avatar size — omit `size` on the
     * passed Indicator.
     */
    topAddon?: ReactElement<IndicatorProps>;
    /**
     * Bottom-right addon — a component reference (not a JSX element) for a
     * trust/verified badge. Avatar instantiates it with the right pixel size
     * for the current avatar size.
     */
    bottomAddon?: AvatarIconComponent;
    /** Accessible name override. Defaults to `name` or `alt`. */
    accessibilityLabel?: string;
    className?: string;
}
export interface AvatarGroupProps {
    /** Avatar children. AvatarGroup will inject `size` via context — children's own `size` prop is ignored. */
    children: ReactNode;
    /** Visual scale applied to all child avatars. Default `'Medium'`. */
    size?: AvatarSize;
    /** Maximum number of avatars to render before collapsing the rest into a "+N" overflow. */
    maxCount?: number;
    className?: string;
}
export interface AvatarGroupContextValue {
    size: AvatarSize;
}
