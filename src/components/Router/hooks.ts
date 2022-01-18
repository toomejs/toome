/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-16 17:14:30 +0800
 * @Updated_at     : 2022-01-18 06:43:21 +0800
 * @Path           : /src/components/Router/hooks.ts
 * @Description    : 路由组件可用钩子
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { useRef, useCallback } from 'react';

import { useUnmount } from 'react-use';

import { NavigateOptions, To, useNavigate } from 'react-router-dom';

import { useStoreSetuped, createStoreHooks, deepMerge } from '@/utils';

import { useFetcherGetter } from '../Fetcher';

import { RouterConfig, RouteOption, RouterStatusType, RouteNavigator, NavigateTo } from './types';
import { factoryRoutes } from './utils';

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
    // Router组件卸载时销毁订阅
    useUnmount(() => {
        unSetupSub();
        listenRoutes();
    });
};

/**
 * 获取路由状态信号的钩子
 */
export const useRouterStatus = createStoreHooks(RouterStatus);
/**
 * 获取路由状态池的钩子
 */
export const useRouter = createStoreHooks(RouterStore);
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
    return {
        addRoutes,
        setRoutes,
    };
};

export const useNavigator = (): RouteNavigator => {
    const flats = RouterStore(useCallback((state) => state.flats, []));
    const navigate = useNavigate();
    return useCallback(
        (to: NavigateTo, options?: NavigateOptions) => {
            let goTo: To | undefined;
            if (typeof to === 'string') goTo = to;
            else if (to.pathname) {
                goTo = { ...to };
            } else {
                const route = flats.find((item) => {
                    if (to.name && item.name === to.name) return true;
                    if (to.id && item.id === to.id) return true;
                    return false;
                });
                if (route && route.path) goTo = { ...to, pathname: route.path };
            }
            if (goTo) navigate(goTo, options);
        },
        [flats, navigate],
    );
};
