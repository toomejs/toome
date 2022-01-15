import { redux } from 'zustand/middleware';

import { createImmer, createStore } from '@/utils';

import { keepAliveReducer } from './utils';

export const KeepAliveSetup = createImmer<{ setuped?: true; generated?: true }>(() => ({}));
// export const KeepAliveStore = createImmer<KeepAliveStoreType>(() => ({
//     path: '/',
//     active: null,
//     include: [],
//     exclude: [],
//     maxLen: 10,
//     notFound: '/errors/404',
// }));
export const KeepAliveStore = createStore(
    redux(keepAliveReducer, {
        path: '/',
        active: null,
        include: [],
        exclude: [],
        maxLen: 10,
        notFound: '/errors/404',
        lives: [],
    }),
);
