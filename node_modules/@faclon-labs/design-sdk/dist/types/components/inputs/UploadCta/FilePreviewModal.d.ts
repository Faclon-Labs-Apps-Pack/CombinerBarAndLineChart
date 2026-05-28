import './FilePreviewModal.css';
export interface FilePreviewModalProps {
    /** File to preview. `null` keeps the modal closed. */
    file: File | null;
    /** Whether the modal is currently open */
    isOpen: boolean;
    /** Called when the modal requests to close */
    onClose: () => void;
    /** Optional override — when provided, replaces the built-in download behavior */
    onDownload?: (file: File) => void;
}
export declare function FilePreviewModal({ file, isOpen, onClose, onDownload }: FilePreviewModalProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace FilePreviewModal {
    var displayName: string;
}
