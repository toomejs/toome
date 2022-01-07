import type { MenuStoreType } from './types';

export const getDefaultMenuStore = (): MenuStoreType => ({
    config: {
        type: 'router',
        server: null,
        menus: [],
    },
    data: [],
});
