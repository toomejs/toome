import { useEffect, useState } from 'react';
import AntdIcon from '@ant-design/icons';
import { Icon as Iconify } from '@iconify/react';

import produce from 'immer';

import classNames from 'classnames';

import { IconType } from './constants';
import { useIcon } from './hooks';
import type { IconComputed, IconProps } from './types';
import { IconSetup } from './store';

const getAntdSvgIcon = ({ config }: { config: IconComputed }) => {
    if ('component' in config) {
        const { component, spin, rotate, className, ...rest } = config;
        return config.component({ className: classNames(className), ...rest });
    }
    const { name, iconfont, className, inline, type, spin, rotate, ...rest } = config;
    return type === IconType.IONIFY ? (
        <Iconify icon={name} {...rest} />
    ) : (
        <svg aria-hidden="true" {...rest}>
            <use xlinkHref={name} />
        </svg>
    );
};
const Icon = (props: IconProps) => {
    const config = useIcon(props);
    const isSetuped = IconSetup((state) => state.setuped);
    const [setuped, setSetuped] = useState(isSetuped);
    useEffect(() => {
        setSetuped(isSetuped);
    }, [isSetuped]);
    if (!setuped) return null;
    if ('type' in config && config.iconfont && config.type === IconType.ICONFONT) {
        const { name, iconfont: FontIcon, inline, className, type, ...rest } = config;
        return <FontIcon type={name} className={classNames(className)} {...rest} />;
    }
    const options = produce(config, (draft) => {
        if (draft.spin) draft.className.push('anticon-spin');
        if (draft.rotate) {
            draft.style.transform = draft.style.transform
                ? `${draft.style.transform} rotate(${draft.rotate}deg)`
                : `rotate(${draft.rotate}deg)`;
        }
    });
    return (
        <AntdIcon
            className={classNames(options.className)}
            component={() => getAntdSvgIcon({ config: options })}
        />
    );
};
export default Icon;
