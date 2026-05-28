import type { ButtonHTMLAttributes } from 'react';
import './PaginationEllipsis.css';
export interface PaginationEllipsisProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /** Skip direction — determines which chevrons icon shows on hover */
    direction: 'previous' | 'next';
}
export declare function PaginationEllipsis({ direction, className, ...props }: PaginationEllipsisProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PaginationEllipsis {
    var displayName: string;
}
