/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-29 11:55:02 +0800
 * @Updated_at     : 2022-01-16 00:29:58 +0800
 * @Path           : /src/components/Config/store.ts
 * @Description    : 配置组件状态池
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { createStore } from '@/utils';

import { ConfigStoreType } from './types';
import { defaultConfig } from './_default.config';
/**
 * 配置组件初始化状态池
 */
export const ConfigSetup = createStore<{ setuped?: true }>(() => ({}));
/**
 * 配置组件状态池
 */
export const ConfigStore = createStore<ConfigStoreType>(() => ({
    config: defaultConfig,
    watchers: {},
}));
