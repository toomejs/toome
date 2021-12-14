import type { CustomIconComponentProps } from '@ant-design/icons/es/components/Icon';
import type { IconFontProps as DefaultIconFontProps } from '@ant-design/icons/lib/components/IconFont';
import type { IconProps as IconifyIconProps } from '@iconify/react';
import type { CSSProperties, FC } from 'react';

import type { IconType } from './constants';

export type IconConfig<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        size?: number;
        classes?: string[];
        style?: CSSProperties;
        prefix?: { svg?: string; iconfont?: string };
        iconfont_urls?: string | string[];
    },
    T
>;
export type IconState<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    Required<Omit<IconConfig, 'iconfont_urls'>> & {
        iconfont?: FC<DefaultIconFontProps<string>>;
    },
    T
>;
export type IconComputed<T extends RecordAnyOrNever = RecordNever> = Omit<
    IconState<T>,
    'prefix' | 'size'
>;
export type BaseIconProps<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    Omit<IconConfig, 'iconfont_urls' | 'size' | 'prefix'> & { name: string },
    T
>;
export type SvgProps<T extends RecordAnyOrNever = RecordNever> = (
    | CustomIconComponentProps
    | React.SVGProps<SVGSVGElement>
) &
    BaseIconProps<
        {
            type?: `${IconType.SVG}`;
        } & T
    >;

export type IconifyProps<T extends RecordAnyOrNever = RecordNever> = BaseIconProps<
    Omit<IconifyIconProps, 'icon'> & {
        type: `${IconType.IONIFY}`;
    } & T
>;

export type IconFontProps<T extends RecordAnyOrNever = RecordNever> = BaseIconProps<
    Omit<DefaultIconFontProps, 'type'> & {
        type: `${IconType.ICONFONT}`;
    } & T
>;
