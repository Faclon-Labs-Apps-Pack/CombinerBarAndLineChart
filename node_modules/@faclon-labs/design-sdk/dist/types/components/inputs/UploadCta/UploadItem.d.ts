import type { HTMLAttributes } from 'react';
import { type FileType } from './FileThumbnail';
import './UploadItem.css';
export type UploadState = 'completed' | 'intermediary' | 'failed' | 'loading';
export interface UploadItemProps extends HTMLAttributes<HTMLDivElement> {
    /** File name to display */
    fileName: string;
    /** File size text (e.g. "1.3 MB") */
    fileSize: string;
    /** File type — drives the thumbnail icon */
    fileType?: FileType;
    /** Upload state */
    uploadState?: UploadState;
    /** Show download action on hover */
    showDownload?: boolean;
    /** Show preview/eye action on hover */
    showPreview?: boolean;
    /** Error message (failed state) */
    errorText?: string;
    /** Upload progress 0–100 (loading state) */
    progress?: number;
    /** Called when remove (X) is clicked */
    onRemove?: () => void;
    /** Called when download is clicked */
    onDownload?: () => void;
    /** Called when preview is clicked */
    onPreview?: () => void;
    /** Called when the retry action is clicked on a failed upload */
    onRetry?: () => void;
}
export declare function UploadItem({ fileName, fileSize, fileType, uploadState, showDownload, showPreview, errorText, progress, onRemove, onDownload, onPreview, className, ...props }: UploadItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace UploadItem {
    var displayName: string;
}
