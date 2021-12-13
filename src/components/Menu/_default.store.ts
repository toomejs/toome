import type { MenuStore } from './types';

export const getDefaultMenuStore = (): MenuStore => ({
    shouldChange: false,
    config: {
        type: 'router',
        server: null,
        menus: [],
    },
    data: [],
});
