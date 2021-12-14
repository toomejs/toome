import Icon from '@ant-design/icons';
import classNames from 'classnames';

import type { FC } from 'react';

import { useIcon } from '../hooks';

import type { SvgProps } from '../types';

const Svg: FC<Omit<SvgProps, 'classes' | 'style' | 'type'>> = ({ name, ...rest }) => {
    return (
        <svg aria-hidden="true" {...rest}>
            <use xlinkHref={name} />
        </svg>
    );
};
const SvgIcon: FC<SvgProps> = (props) => {
    const config = useIcon(props);
    const { name, classes, style, type, ...rest } = config;
    return (
        <Icon
            component={() => Svg({ name, ...rest })}
            className={classNames(classes)}
            style={style}
        />
    );
};
export default SvgIcon;
