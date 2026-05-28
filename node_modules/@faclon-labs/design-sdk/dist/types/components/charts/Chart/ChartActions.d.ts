import type { ReactNode } from 'react';
export interface ChartActionsProps {
    /**
     * Click handler for the Info icon. Use this to open a popover describing
     * the selected chart. The button is rendered when this is provided
     * (or when `showInfo` is explicitly `true`).
     */
    onInfoClick?: () => void;
    /**
     * Click handler for the Settings icon. Use this to open the chart's
     * configuration panel (time drill-down, legends, data labels, clipping,
     * scrollable, inexact multiple, etc).
     */
    onSettingsClick?: () => void;
    /**
     * Click handler for the More icon. Use this to open the export menu
     * (PNG / JPEG / Excel / SVG / CSV / Full-screen) or any other menu.
     */
    onMoreClick?: () => void;
    /** Force-show the Info button even if `onInfoClick` is undefined */
    showInfo?: boolean;
    /** Force-show the Settings button even if `onSettingsClick` is undefined */
    showSettings?: boolean;
    /** Force-show the More button even if `onMoreClick` is undefined */
    showMore?: boolean;
    /** Override the default `aria-label` for the Info button */
    infoLabel?: string;
    /** Override the default `aria-label` for the Settings button */
    settingsLabel?: string;
    /** Override the default `aria-label` for the More button */
    moreLabel?: string;
    /**
     * Optional extra trailing actions rendered after the More button.
     * Pass `<IconButton>` elements (or any node) to extend the standard set.
     */
    trailing?: ReactNode;
}
export declare function ChartActions({ onInfoClick, onSettingsClick, onMoreClick, showInfo, showSettings, showMore, infoLabel, settingsLabel, moreLabel, trailing, }: ChartActionsProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ChartActions {
    var displayName: string;
}
