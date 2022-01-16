/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-26 12:03:29 +0800
 * @Updated_at     : 2022-01-16 00:27:49 +0800
 * @Path           : /src/components/Auth/store.ts
 * @Description    : Auth组件状态池
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { createStore } from '@/utils';

import { AuthStoreType } from './types';

/**
 * 账户状态储存池
 */
export const AuthStore = createStore<AuthStoreType>(() => ({
    token: null,
    user: null,
    inited: false,
}));
