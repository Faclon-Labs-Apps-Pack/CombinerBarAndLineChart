import type { FileType } from './FileThumbnail';
import type { UploadFile } from './FileUpload';
export type PreviewKind = 'image' | 'pdf' | 'text' | 'unsupported';
export declare function formatFileSize(bytes: number): string;
export declare function deriveFileTypeFromName(name: string): FileType;
export declare function previewKindFor(file: File): PreviewKind;
export declare function ensureFileId(f: UploadFile, idx: number): string;
export declare function triggerDownload(file: File): void;
