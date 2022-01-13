/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-14 00:07:50 +0800
 * Updated_at     : 2022-01-13 22:51:52 +0800
 * Path           : /src/components/Router/_default.config.tsx
 * Description    : 路由组件默认配置
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { Spinner } from '@/components/Spinner';

import { RouterStoreType } from './types';

export const getDefaultStore: <M extends RecordNever>() => RouterStoreType<M> = () => ({
    routes: [],
    items: [],
    flats: [],
    renders: [],
    maps: {},
    config: {
        basePath: '/',
        hash: false,
        server: null,
        loading: () => <Spinner name="Box" center />,
        auth: {
            enabled: true,
            login_redirect: '/auth/login',
            white_list: [],
            role_column: 'name',
            permission_column: 'name',
            redirect: 'login',
        },
        // permission: {
        //     enabled: true,
        //     column: 'name',
        // },
        routes: {
            constants: [],
            dynamic: [],
        },
    },
});
