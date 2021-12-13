import { Icon, InlineIcon } from '@iconify/react';
import classNames from 'classnames';
import type { FC } from 'react';

import { useIcon } from '../hooks';
import type { IonifyPropsType } from '../types';

const Ionify: FC<IonifyPropsType> = (props) => {
    const { type, component, style, classes, iconfont, children, inline, ...rest } = useIcon(props);
    const isInline = typeof inline === 'boolean' ? inline : true;
    return isInline ? (
        <InlineIcon {...rest} icon={component} className={classNames(classes)} style={style} />
    ) : (
        <Icon {...rest} icon={component} className={classNames(classes)} style={style} />
    );
};
export default Ionify;
