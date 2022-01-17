import { createReduxStore, createStore } from '@/utils';

import { keepAliveReducer } from './utils';

export const KeepAliveSetup = createStore<{ setuped?: true; generated?: true }>(() => ({}));

export const KeepAliveStore = createReduxStore(
    keepAliveReducer,
    {
        path: '/',
        active: null,
        include: [],
        exclude: [],
        maxLen: 10,
        notFound: '/errors/404',
        lives: [],
    },
    // redux(keepAliveReducer, {
    //     path: '/',
    //     active: null,
    //     include: [],
    //     exclude: [],
    //     maxLen: 10,
    //     notFound: '/errors/404',
    //     lives: [],
    // }),
);
