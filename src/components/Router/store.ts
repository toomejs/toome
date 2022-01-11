/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-16 17:08:42 +0800
 * @Updated_at     : 2022-01-09 14:29:48 +0800
 * @Path           : /src/components/Router/store.ts
 * @Description    : 路由组件状态池
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { createImmberSubsciber } from '@/utils';

import { getDefaultStore } from './_default.config';
import { RouterStatusType, RouterStoreType } from './types';

/**
 * 路由初始化信号状态池
 */
export const RouterStatus = createImmberSubsciber<RouterStatusType>(() => ({
    next: false,
    ready: false,
    success: false,
}));
/**
 * 路由状态池
 */
export const RouterStore = createImmberSubsciber<RouterStoreType>(() => getDefaultStore());
