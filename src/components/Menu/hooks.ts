/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-16 05:55:08 +0800
 * @Updated_at     : 2022-01-09 21:43:43 +0800
 * @Path           : /src/components/Menu/hooks.ts
 * @Description    : 可用的菜单组件钩子
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { useCallback } from 'react';

import { useUnmount } from 'react-use';

import { createHookSelectors, deepMerge, useStoreSetuped } from '@/utils';

import { AuthStore } from '../Auth';

import { useFetcherGetter } from '../Fetcher';

import { RouterStore } from '../Router/store';

import { MenuConfig, MenuOption, MenuStatusType } from './types';
import { changeMenus } from './utils';
import { MenuStatus, MenuStore } from './store';
/**
 * 动态菜单状态池
 */
export const useMenu = createHookSelectors(MenuStore);
/**
 * 动态菜单数据
 */
export const useMenus = () => MenuStore(useCallback((state) => state.data, []));
// export const useAntdMenus = () => MenuStore(useCallback((state) => getAntdMenus(state.data), []));

/**
 * 初始化菜单
 * @param config 菜单配置
 */
export const useSetupMenu = <T extends RecordAnyOrNever = RecordNever, M = MenuOption<T>>(
    config?: MenuConfig<M>,
) => {
    // fech工具用于获取远程菜单
    const fecher = useFetcherGetter();
    // 订阅next以刷新菜单数据
    const unMenuSub = MenuStatus.subscribe(
        (state) => state.next,
        (next) => changeMenus(next, fecher()),
    );
    // 订阅user,如果获取菜单的方式为独立配置则在user改变时刷新菜单
    const unAuthSub = AuthStore.subscribe(
        (state) => state.user,
        () => {
            const { setuped } = MenuStatus.getState();
            const { type } = MenuStore.getState().config;
            if (setuped && type !== 'router') {
                MenuStatus.setState((state) => {
                    state.next = true;
                });
            }
        },
    );
    // 订阅路由列表,如果获取菜单的方式为通过路由携带则在路由列表改变时刷新菜单
    const unRouterSub = RouterStore.subscribe(
        (state) => state.routes,
        () => {
            const { setuped } = MenuStatus.getState();
            const { type } = MenuStore.getState().config;
            if (setuped && type === 'router') {
                MenuStatus.setState((state) => {
                    state.next = true;
                });
            }
        },
    );
    /** 合并传入配置生成菜单状态 */
    useStoreSetuped<MenuStatusType>({
        store: MenuStatus,
        callback: () => {
            MenuStore.setState((state) => {
                state.config = deepMerge(state.config, config ?? {});
            });
        },
    });
    useUnmount(() => {
        unRouterSub();
        unAuthSub();
        unMenuSub();
    });
};
