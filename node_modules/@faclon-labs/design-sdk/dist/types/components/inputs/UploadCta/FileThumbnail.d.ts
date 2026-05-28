import type { HTMLAttributes } from 'react';
import './FileThumbnail.css';
export type FileType = 'xyz' | 'xlsx' | 'csv' | 'pdf' | 'docx' | 'png' | 'jpg' | 'svg' | 'json' | 'error';
export interface FileThumbnailProps extends HTMLAttributes<HTMLDivElement> {
    /** File type — determines accent color and label */
    type?: FileType;
}
export declare function FileThumbnail({ type, className, ...props }: FileThumbnailProps): import("react/jsx-runtime").JSX.Element;
export declare namespace FileThumbnail {
    var displayName: string;
}
