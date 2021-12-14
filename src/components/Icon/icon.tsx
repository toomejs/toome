import type { FC } from 'react';

import IconFont from './components/iconfont';

import Ionify from './components/ionify';
import SvgIcon from './components/svgicon';

import { IconType } from './constants';
import type { IconFontProps, IconifyProps, SvgProps } from './types';

const Icon: FC<IconifyProps | IconFontProps | SvgProps> = (props) => {
    if (props.type === IconType.IONIFY) {
        return <Ionify {...props} />;
    }
    if (props.type === IconType.ICONFONT) return <IconFont {...props} />;
    return <SvgIcon {...props} />;
};
export default Icon;
