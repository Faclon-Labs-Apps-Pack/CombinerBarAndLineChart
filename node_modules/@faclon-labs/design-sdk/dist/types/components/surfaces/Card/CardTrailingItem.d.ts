import type { HTMLAttributes, ReactNode } from 'react';
import './CardTrailingItem.css';
export type CardTrailingType = 'None' | 'Action' | 'Link' | 'Badge';
export interface CardTrailingItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Type of trailing item — controls layout wrapper */
    trailing?: CardTrailingType;
    /**
     * Content slot — pass your Badge, LinkButton, or IconButton here.
     *
     * Examples:
     * - trailing='Action' → <IconButton icon={<Download />} ... />
     * - trailing='Link'   → <LinkButton type="Action" label="Link" ... />
     * - trailing='Badge'  → <Badge color="Positive" label="Label" ... />
     */
    children?: ReactNode;
}
export declare function CardTrailingItem({ trailing, children, className, ...rest }: CardTrailingItemProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace CardTrailingItem {
    var displayName: string;
}
