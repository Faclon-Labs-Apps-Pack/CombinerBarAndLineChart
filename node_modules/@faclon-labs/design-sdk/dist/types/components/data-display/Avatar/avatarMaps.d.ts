import type { CSSProperties } from 'react';
import type { IndicatorSize } from '../Indicator/Indicator';
import type { AvatarSize, AvatarVariant } from './types';
export declare const avatarToIndicatorSize: Record<AvatarSize, IndicatorSize>;
export declare const avatarToBottomAddonPx: Record<AvatarSize, number>;
export declare const avatarTopAddonOffsets: Record<AvatarVariant, Record<AvatarSize, Pick<CSSProperties, 'top' | 'right'>>>;
