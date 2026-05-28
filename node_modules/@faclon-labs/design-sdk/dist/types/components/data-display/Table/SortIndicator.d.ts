export interface SortIndicatorProps {
    direction: 'asc' | 'desc' | null;
}
/**
 * Sort indicator — two stacked react-feather chevrons. Mirrors Blade's
 * `SortIcon` shape (up on top, down below) but built from react-feather glyphs
 * + Faclon text-color tokens. Direction convention (Material / Blade):
 *   - asc  → DOWN arrow active   (data flows: smallest at top → largest at bottom)
 *   - desc → UP   arrow active
 *
 * The slot is ALWAYS reserved (rendered in the disabled colour when not
 * active) so columns don't jump on first sort.
 */
export declare function SortIndicator({ direction }: SortIndicatorProps): import("react/jsx-runtime").JSX.Element;
