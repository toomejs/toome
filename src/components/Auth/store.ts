/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-26 12:03:29 +0800
 * @Updated_at     : 2022-01-09 14:29:07 +0800
 * @Path           : /src/components/Auth/store.ts
 * @Description    : Auth组件状态池
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { createImmberSubsciber } from '@/utils';

import { AuthStoreType } from './types';

/**
 * 账户状态储存池
 */
export const AuthStore = createImmberSubsciber<AuthStoreType>(() => ({
    token: null,
    user: null,
    inited: false,
}));
