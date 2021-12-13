import type { IconState } from './types';

export const getDefaultIconConfig = (): IconState => ({
    size: 16,
    style: {},
    classes: [],
    iconfont: {
        prefix: 'icon',
    },
    spin: false,
    rotate: 0,
});
