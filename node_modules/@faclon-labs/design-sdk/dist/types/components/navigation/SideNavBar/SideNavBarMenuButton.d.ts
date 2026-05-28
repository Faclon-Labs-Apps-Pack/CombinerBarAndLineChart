import { type ElementType, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
export interface SideNavBarMenuButtonProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick' | 'title'> {
    /** Icon — required, 16 px nominal. */
    icon: ReactNode;
    /** Label — visible when expanded. */
    label: string;
    /** Active (current route). */
    isActive?: boolean;
    /** Disabled state. */
    isDisabled?: boolean;
    /** href turns it into an `<a>`. */
    href?: string;
    /** Anchor target. */
    target?: string;
    /** Override the rendered element. */
    as?: ElementType;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    /** Trailing slot — Badge, Action, etc. Auto-hidden when collapsed. */
    trailing?: ReactNode;
}
export declare const SideNavBarMenuButton: import("react").ForwardRefExoticComponent<SideNavBarMenuButtonProps & import("react").RefAttributes<HTMLElement>>;
