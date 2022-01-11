/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-29 11:55:02 +0800
 * @Updated_at     : 2022-01-10 13:55:00 +0800
 * @Path           : /src/components/Config/store.ts
 * @Description    : 配置组件状态池
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { createImmberSubsciber } from '@/utils';

import { ConfigStoreType } from './types';
import { defaultConfig } from './_default.config';
/**
 * 配置组件初始化状态池
 */
export const ConfigSetup = createImmberSubsciber<{ setuped?: true }>(() => ({}));
/**
 * 配置组件状态池
 */
export const ConfigStore = createImmberSubsciber<ConfigStoreType>(() => ({
    config: defaultConfig,
    watchers: {},
}));
