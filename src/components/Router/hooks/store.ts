import { useCallback } from 'react';
import create from 'zustand';

import { createHookSelectors, createSubsciberImmer } from '@/utils';

import { getDefaultStore } from '../_defaultConfig';
import type { RouteOption, RouterStore } from '../types';

/**
 * 路由初始化信号
 */
export const RouterSetup = create(() => ({}));
export const useRouterStore = createSubsciberImmer<RouterStore>(() => getDefaultStore());
export const useRouter = createHookSelectors(useRouterStore);
export const useRouterReset = () =>
    useCallback(() => {
        useRouterStore.setState((state) => {
            state.signal.shouldChange = true;
            state.signal.canGenerate = false;
            state.signal.generated = false;
        });
    }, []);

export const useRoutesChange = () => {
    const addRoutes = useCallback(<T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
        useRouterStore.setState((state) => {
            state.config.routes.dynamic = [...state.config.routes.dynamic, ...items];
            state.signal.shouldChange = true;
            state.signal.canGenerate = false;
            state.signal.generated = false;
        });
    }, []);
    const setRoutes = useCallback(<T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
        useRouterStore.setState((state) => {
            state.config.routes.dynamic = [...items];
            state.signal.shouldChange = true;
            state.signal.canGenerate = false;
            state.signal.generated = false;
        });
    }, []);
    return {
        addRoutes,
        setRoutes,
    };
};
