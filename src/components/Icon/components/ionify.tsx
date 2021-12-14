import { Icon } from '@iconify/react';
import classNames from 'classnames';

import type { FC } from 'react';

import { useIcon } from '../hooks';
import type { IconifyProps } from '../types';

const Ionify: FC<Omit<IconifyProps, 'type'>> = (props) => {
    const config = useIcon(props);
    const { name, classes, type, ...rest } = config;
    return <Icon icon={name} className={classNames(classes)} {...rest} />;
};
export default Ionify;
