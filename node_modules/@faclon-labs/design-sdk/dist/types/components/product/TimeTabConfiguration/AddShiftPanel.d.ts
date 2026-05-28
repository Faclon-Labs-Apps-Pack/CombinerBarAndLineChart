import type { GTPShift } from './types';
import './AddShiftPanel.css';
interface AddShiftPanelProps {
    onClose: () => void;
    onSave: (shift: GTPShift) => void;
    shift?: GTPShift;
}
export declare function AddShiftPanel({ onClose, onSave, shift }: AddShiftPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
