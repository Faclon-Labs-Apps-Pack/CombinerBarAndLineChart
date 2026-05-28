import type { HTMLAttributes, ReactNode } from 'react';
import './CardBody.css';
export interface CardBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Body text (rendered when no children provided) */
    bodyText?: string;
    /** Custom body content slot — takes precedence over bodyText */
    children?: ReactNode;
}
export declare function CardBody({ bodyText, children, className, ...rest }: CardBodyProps): import("react/jsx-runtime").JSX.Element;
export declare namespace CardBody {
    var displayName: string;
}
