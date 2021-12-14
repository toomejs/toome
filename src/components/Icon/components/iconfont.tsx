import classNames from 'classnames';

import type { FC } from 'react';

import { useIcon } from '../hooks';
import type { IconFontProps } from '../types';

const IconFont: FC<Omit<IconFontProps, 'type'>> = (props) => {
    const config = useIcon(props);
    const { name, classes, iconfont: Icon, type, ...rest } = config;
    return Icon ? <Icon {...rest} type={name} className={classNames(classes)} /> : null;
};
export default IconFont;
