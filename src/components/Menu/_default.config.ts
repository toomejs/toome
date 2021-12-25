import type { MenuStoreType } from './types';

export const getDefaultMenuStore = (): MenuStoreType => ({
    shouldChange: false,
    config: {
        type: 'router',
        server: null,
        menus: [],
    },
    data: [],
});
