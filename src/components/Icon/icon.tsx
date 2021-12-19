import classNames from 'classnames';

import { memo, useEffect, useState } from 'react';
import AntdIcon from '@ant-design/icons';
import { Icon as Iconify } from '@iconify/react';

import produce from 'immer';

import { IconType } from './constants';
import { Setuped, useIcon } from './hooks';
import type { IconComputed, IconProps } from './types';

const getAntdSvgIcon = ({ config }: { config: IconComputed }) => {
    if ('component' in config) {
        const { component, classes, style, spin, rotate, ...rest } = config;
        return config.component({ className: classNames(classes), style, ...rest });
    }
    const { name, iconfont, inline, type, spin, rotate, classes, ...rest } = config;
    return type === IconType.IONIFY ? (
        <Iconify icon={name} className={classNames(classes)} {...rest} />
    ) : (
        <svg aria-hidden="true" className={classNames(classes)} {...rest}>
            <use xlinkHref={name} />
        </svg>
    );
};
const Icon = memo((props: IconProps) => {
    const config = useIcon(props);
    const isSetuped = Setuped((state) => state.setuped);
    const [setuped, setSetuped] = useState(isSetuped);
    useEffect(() => {
        setSetuped(isSetuped);
    }, [isSetuped]);
    if (!setuped) return null;
    if ('type' in config && config.iconfont && config.type === IconType.ICONFONT) {
        const { name, classes, iconfont: FontIcon, inline, type, style, ...rest } = config;
        return <FontIcon type={name} className={classNames(classes)} style={style} {...rest} />;
    }
    const options = produce(config, (draft) => {
        if (draft.spin) draft.classes.push('anticon-spin');
        if (draft.rotate)
            draft.style.transform = draft.style.transform
                ? `${draft.style.transform} rotate(${draft.rotate}deg)`
                : `rotate(${draft.rotate}deg)`;
    });
    return <AntdIcon component={() => getAntdSvgIcon({ config: options })} />;
});
export default Icon;
