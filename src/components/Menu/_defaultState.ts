import type { MenuState } from './types';

export const getDefaultMenuState = (): MenuState => ({
    type: 'router',
    server: null,
    menus: [],
});
