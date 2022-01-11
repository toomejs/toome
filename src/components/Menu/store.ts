/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-24 06:16:29 +0800
 * @Updated_at     : 2022-01-09 21:43:36 +0800
 * @Path           : /src/components/Menu/store.ts
 * @Description    : 菜单组件状态池
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { createImmberSubsciber } from '@/utils';

import { getDefaultMenuStore } from './_default.config';
import { MenuStoreType, MenuStatusType } from './types';
/**
 * 菜单信号状态管理池
 */
export const MenuStatus = createImmberSubsciber<MenuStatusType>(() => ({ next: false }));
/**
 * 菜单数据状态管理池
 */
export const MenuStore = createImmberSubsciber<MenuStoreType>(() => getDefaultMenuStore());
