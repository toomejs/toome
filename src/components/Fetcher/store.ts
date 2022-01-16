/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-25 05:01:46 +0800
 * @Updated_at     : 2022-01-16 00:29:34 +0800
 * @Path           : /src/components/Fetcher/store.ts
 * @Description    : Fetcher组件状态池
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import create from 'zustand';

import { createStore } from '@/utils';

import { FetcherStoreType } from './types';
/**
 * Fetcher组件初始化状态
 */
export const FetcherSetup = create<{ setuped?: true }>(() => ({}));
/**
 * Fetcher组件状态池
 */
export const FetcherStore = createStore<FetcherStoreType>(() => ({
    axios: {},
    swr: {},
}));
