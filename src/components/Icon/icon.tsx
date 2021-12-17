import classNames from 'classnames';
import type { FC } from 'react';

import AntdIcon from '@ant-design/icons';

import { Icon as Iconify } from '@iconify/react';

import { IconType } from './constants';
import { useIcon } from './hooks';
import type { IconFontProps, IconifyProps, SvgProps, XiconsProps } from './types';

const Svg: FC<Omit<SvgProps, 'classes' | 'style' | 'type'>> = ({ name, ...rest }) => {
    return (
        <svg aria-hidden="true" {...rest}>
            <use xlinkHref={name} />
        </svg>
    );
};
const XIcon: FC<{ name: string }> = ({ name }) => <img src={name} alt={name} />;
const Icon: FC<IconifyProps | IconFontProps | SvgProps | XiconsProps> = (props) => {
    const config = useIcon(props);
    const { name, classes, style, iconfont: FontIcon, type, ...rest } = config;
    if (type === IconType.ICONFONT) {
        return FontIcon ? <FontIcon {...rest} type={name} className={classNames(classes)} /> : null;
    }
    if (type === IconType.XICONS) {
        console.log(name);
        return (
            <AntdIcon
                component={() => XIcon({ name })}
                className={classNames(classes)}
                style={style}
            />
        );
    }
    if (props.type === IconType.IONIFY) {
        return <Iconify icon={name} className={classNames(classes)} {...rest} />;
    }
    return (
        <AntdIcon
            component={() => Svg({ name, ...rest })}
            className={classNames(classes)}
            style={style}
        />
    );
};
export default Icon;
