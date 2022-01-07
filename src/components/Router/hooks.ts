import { useRef, useCallback } from 'react';

import { useUnmount } from 'react-use';

import { useStoreSetuped, debounceRun, createHookSelectors, deepMerge } from '@/utils';

import { useFetcherGetter } from '../Fetcher';

import type { RouterConfig, RouteOption, RouterStatusType } from './types';
import { factoryRoutes, generateFinalRoutes } from './utils';

import { RouterStore, RouterStatus } from './store';

/**
 * 初始化路由功能
 * @param {RouterConfig<T>} config - 路由配置,(*)必填
 */
export const useSetupRouter = <T extends RecordAnyOrNever>(config: RouterConfig<T>) => {
    const fetcher = useFetcherGetter();
    const changing = useRef();
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

    useUnmount(() => {
        unSetupSub();
        unChangeSub();
        unGenerateSub();
    });

    const unSetupSub = RouterStatus.subscribe(
        (state) => state.setuped,
        (setuped) => {
            if (!setuped) return;
            unSetupSub();
            if (!RouterStore.getState().config.auth.enabled) {
                RouterStatus.setState((state) => {
                    state.next = true;
                });
            }
        },
    );

    const unChangeSub = RouterStatus.subscribe(
        (state) => state.next,
        (next) => {
            if (next) debounceRun(changing, () => factoryRoutes(fetcher()));
        },
    );
    const unGenerateSub = RouterStatus.subscribe(
        (state) => state.ready,
        (ready) => {
            if (ready) debounceRun(generating, () => generateFinalRoutes());
        },
    );
};

/**
 * 路由初始化信号
 */
export const useRouterStatus = createHookSelectors(RouterStatus);
export const useRouter = createHookSelectors(RouterStore);
export const useRouterReset = () =>
    useCallback(() => {
        RouterStatus.setState((state) => ({ ...state, next: true, ready: false, success: false }));
    }, []);

export const useRoutesChange = () => {
    const addRoutes = useCallback(<T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
        RouterStore.setState((state) => {
            state.config.routes.dynamic = [...state.config.routes.dynamic, ...items];
        });
        RouterStatus.setState((state) => ({ ...state, next: true, ready: false, success: false }));
    }, []);
    const setRoutes = useCallback(<T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
        RouterStore.setState((state) => {
            state.config.routes.dynamic = [...items];
        });
        RouterStatus.setState((state) => ({ ...state, next: true, ready: false, success: false }));
    }, []);
    return {
        addRoutes,
        setRoutes,
    };
};
