import type { ButtonHTMLAttributes } from 'react';
import './PageNumber.css';
export interface PageNumberProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    page: number;
    isSelected?: boolean;
}
export declare function PageNumber({ page, isSelected, className, ...props }: PageNumberProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PageNumber {
    var displayName: string;
}
