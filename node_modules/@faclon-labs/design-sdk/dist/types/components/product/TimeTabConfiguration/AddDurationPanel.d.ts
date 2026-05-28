import type { GTPPreset } from './types';
import './AddDurationPanel.css';
interface AddDurationPanelProps {
    onClose: () => void;
    onSave: (preset: GTPPreset) => void;
    preset?: GTPPreset;
}
export declare function AddDurationPanel({ onClose, onSave, preset }: AddDurationPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
