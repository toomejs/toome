/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-16 17:14:30 +0800
 * @Updated_at     : 2022-01-14 17:35:50 +0800
 * @Path           : /src/components/Router/hooks.ts
 * @Description    : 路由组件可用钩子
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { useRef, useCallback } from 'react';

import { useUnmount } from 'react-use';

import { isFunction } from 'lodash-es';

import { produce } from 'immer';

import { useStoreSetuped, debounceRun, createHookSelectors, deepMerge } from '@/utils';

import { useFetcherGetter } from '../Fetcher';

import { RouterConfig, RouteOption, RouterStatusType, RouteItem } from './types';
import { factoryFinalRoutes, factoryRenders, factoryRoutes } from './utils';

import { RouterStore, RouterStatus } from './store';

/**
 * 初始化路由功能
 * @param config 路由配置
 */
export const useSetupRouter = <T extends RecordAnyOrNever>(config: RouterConfig<T>) => {
    /**  api请求实例获取函数 */
    const fetcher = useFetcherGetter();
    /** 路由状态记忆变量,用于防止短时间内多次生成路由渲染列表 */
    const generating = useRef();
    // 初始化路由
    useStoreSetuped<RouterStatusType>({
        store: RouterStatus,
        callback: () => {
            RouterStore.setState((state) => {
                state.config = deepMerge(state.config, config ?? {}, 'replace') as any;
            }, true);
        },
    });

    // 如果路由不依赖于Auth的状态则在初始化后直接开始生成配置列表
    const unSetupSub = RouterStatus.subscribe(
        (state) => state.setuped,
        (setuped) => {
            if (!setuped) return;
            // 一旦初始化后就不再监听setuped状态
            unSetupSub();
            if (!RouterStore.getState().config.auth.enabled) {
                RouterStatus.setState((state) => {
                    state.next = true;
                });
            }
        },
    );
    // 订阅路由刷新状态用于生成新的路由列表
    const listenRoutes = RouterStatus.subscribe(
        (state) => state.next,
        (next) => {
            if (next) factoryRoutes(fetcher());
        },
    );

    const listenItems = RouterStore.subscribe(
        (state) => state.items,
        (items) => factoryRenders(items),
    );

    const listenRenders = RouterStore.subscribe(
        (state) => state.renders,
        (renders) => {
            debounceRun(generating, () => factoryFinalRoutes(renders));
        },
    );

    // Router组件卸载时销毁订阅
    useUnmount(() => {
        unSetupSub();
        listenRoutes();
        listenItems();
        listenRenders();
    });
};

/**
 * 获取路由状态信号的钩子
 */
export const useRouterStatus = createHookSelectors(RouterStatus);
/**
 * 获取路由状态池的钩子
 */
export const useRouter = createHookSelectors(RouterStore);
/**
 * 刷新路由
 */
export const useRouterReset = () =>
    useCallback(() => {
        RouterStatus.setState((state) => ({
            ...state,
            next: true,
            success: false,
        }));
    }, []);
/**
 * 路由列表操作
 */
export const useRoutesChange = () => {
    const addRoutes = useCallback(
        /**
         * 添加动态路由
         * @param items 新增路由列表
         */
        <T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
            RouterStore.setState((state) => {
                state.config.routes.dynamic = [...state.config.routes.dynamic, ...items];
            });
            RouterStatus.setState((state) => ({
                ...state,
                next: true,
                success: false,
            }));
        },
        [],
    );
    const setRoutes = useCallback(
        /**
         * 重置动态路由
         * @param items 路由列表
         */
        <T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
            RouterStore.setState((state) => {
                state.config.routes.dynamic = [...items];
            });
            RouterStatus.setState((state) => ({
                ...state,
                next: true,
                success: false,
            }));
        },
        [],
    );
    const changeRouteItems = useCallback(
        (items: RouteItem[] | ((old: RouteItem[]) => RouteItem[])) => {
            RouterStore.setState((state) => {
                state.items = isFunction(items) ? produce(state.items, items) : items;
            });
        },
        [],
    );
    return {
        changeRouteItems,
        addRoutes,
        setRoutes,
    };
};
