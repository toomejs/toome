import { LayoutStorageStoreType } from './types';

export const defaultConfig: LayoutStorageStoreType = {
    mode: 'side',
    collapsed: false,
    theme: {
        header: 'light',
        sidebar: 'dark',
        embed: 'light',
    },
    fixed: {
        header: false,
        sidebar: false,
        embed: false,
    },
    vars: {
        sidebarWidth: '200px',
        sidebarCollapseWidth: '64px',
        headerHeight: '48px',
        headerLightColor: '#fff',
    },
};
