import type { IconFontProps } from '@ant-design/icons/lib/components/IconFont';
import type { CSSProperties, FC } from 'react';

export type IconConfig<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        size?: number;
        classes?: string[];
        style?: CSSProperties;
        iconfont?: {
            url?: string | string[];
            prefix?: string;
        };
        spin?: boolean;
        rotate?: number;
    },
    T
>;
export type IconState<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    ReRequired<Omit<IconConfig, 'iconfont' | 'style'>> & {
        style: CSSProperties;
        iconfont: {
            prefix: string;
            instance?: FC<IconFontProps<string>>;
        };
    },
    T
>;
export type IconProps<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    Omit<IconConfig, 'iconfont'>,
    T
>;
