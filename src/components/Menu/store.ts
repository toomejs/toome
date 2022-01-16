/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-24 06:16:29 +0800
 * @Updated_at     : 2022-01-16 14:02:41 +0800
 * @Path           : /src/components/Menu/store.ts
 * @Description    : 菜单组件状态池
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */

import { createStore } from '@/utils';

import { getDefaultMenuStore } from './_default.config';
import { MenuStoreType, MenuStatusType } from './types';
/**
 * 菜单信号状态管理池
 */
export const MenuStatus = createStore<MenuStatusType>(() => ({ next: false }));
/**
 * 菜单数据状态管理池
 */
export const MenuStore = createStore<MenuStoreType>(() => getDefaultMenuStore());
