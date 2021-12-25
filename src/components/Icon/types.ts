import type { IconFontProps as DefaultIconFontProps } from '@ant-design/icons/lib/components/IconFont';
// import type { IconProps as IconifyIconProps } from '@iconify/react';
import type { CSSProperties, FC, RefAttributes, SVGProps } from 'react';

import type { IconPrefixType, IconType } from './constants';

export type IconName = `${IconPrefixType}:${string}`;
export type IconComponent = FC<BaseElementProps>;
export type IconConfig<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        size?: number | string;
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
export type IconComputed = {
    spin?: boolean;
    rotate?: number;
    className: string[];
    style: CSSProperties;
} & (
    | {
          name: string;
          type: `${IconType}`;
          inline?: boolean;
          iconfont?: FC<DefaultIconFontProps<string>>;
      }
    | {
          component: FC<BaseElementProps>;
      }
);
export interface BaseIconProps extends Omit<BaseElementProps, 'className' | 'name' | 'inline'> {
    className?: string;
    spin?: boolean;
    rotate?: number;
}
export interface SvgProps extends BaseIconProps {
    name: IconName;
    component?: never;
    inline?: boolean;
}
export interface ComponentProps extends BaseIconProps {
    name?: never;
    component: IconComponent;
}

export type IconProps = SvgProps | ComponentProps;

type BaseElementProps = RefAttributes<HTMLSpanElement> & SVGProps<SVGSVGElement>;
