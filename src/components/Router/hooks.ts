import { useCallback } from 'react';

import { createHookSelectors, createImmer } from '@/utils/store';

import { getDefaultStore } from './_defaultConfig';
import type { RouterStore, RouteOption } from './types';

export const useRouterStore = createImmer<RouterStore>(() => getDefaultStore());
export const useRouter = createHookSelectors(useRouterStore);
export const useRouterReset = () =>
    useCallback(() => {
        useRouterStore.setState((state) => {
            state.signal.shouldChange = true;
        });
    }, []);

export const useRoutesChange = () => {
    const addRoutes = useCallback(<T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
        useRouterStore.setState((state) => {
            state.config.routes.dynamic = [...state.config.routes.dynamic, ...items];
            state.signal.shouldChange = true;
        });
    }, []);
    const setRoutes = useCallback(<T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
        useRouterStore.setState((state) => {
            state.config.routes.dynamic = [...items];
            state.signal.shouldChange = true;
        });
    }, []);
    return {
        addRoutes,
        setRoutes,
    };
};
