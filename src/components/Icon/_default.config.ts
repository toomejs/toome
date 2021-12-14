import type { IconState } from './types';

export const getDefaultIconConfig = (): IconState => ({
    size: 16,
    style: {},
    classes: [],
    prefix: { svg: 'svg', iconfont: 'icon' },
});
