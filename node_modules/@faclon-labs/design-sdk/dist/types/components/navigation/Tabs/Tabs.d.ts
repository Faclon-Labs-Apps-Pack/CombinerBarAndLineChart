import { type HTMLAttributes, type ReactNode } from 'react';
import { type TabsOrientation, type TabsSize, type TabsVariant } from './TabsContext';
import './Tabs.css';
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Controlled selected value. */
    value?: string;
    /** Uncontrolled initial selected value. */
    defaultValue?: string;
    /** Fired when selection changes (both controlled and uncontrolled).
     *  Named `onChange` to match Blade's Tabs API. */
    onChange?: (value: string) => void;
    /** Alias of `onChange`. */
    onValueChange?: (value: string) => void;
    /** Visual style. */
    variant?: TabsVariant;
    size?: TabsSize;
    orientation?: TabsOrientation;
    /**
     * When true, TabItems stretch to share the tablist width. Horizontal-only —
     * vertical TabItems always fill the parent width regardless of this prop.
     * Also ignored when `variant="Filled"`, which always renders as a segmented
     * enclosure per the Figma spec.
     */
    isFullWidthTabItem?: boolean;
    children: ReactNode;
}
export declare const Tabs: import("react").ForwardRefExoticComponent<TabsProps & import("react").RefAttributes<HTMLDivElement>>;
