import { useRef } from 'react';

import { useStoreSetuped, debounceRun, deepMerge } from '@/utils';

import { useFetcher } from '../../Request';

import type { RouterConfig } from '../types';
import { factoryRoutes, generateFinalRoutes } from '../utils';

import { RouterSetup, useRouterStore } from './store';
/**
 * 初始化路由功能
 * @param {RouterConfig<T>} config - 路由配置,(*)必填
 */
export const useSetupRouter = <T extends RecordAnyOrNever>(config: RouterConfig<T>) => {
    const fecher = useFetcher();
    const changing = useRef();
    const generating = useRef();

    // 初始化路由
    useStoreSetuped(
        {
            store: RouterSetup,
            callback: () => {
                useRouterStore.setState((state) => {
                    state.config = deepMerge(state.config, config ?? {}, 'replace') as any;
                    state.signal.shouldChange = !state.config.auth.enabled;
                }, true);
                useRouterStore.subscribe(
                    (state) => state.signal.shouldChange,
                    (shouldChange) => {
                        if (shouldChange) debounceRun(changing, () => factoryRoutes(fecher));
                    },
                );
                useRouterStore.subscribe(
                    (state) => state.signal.canGenerate,
                    (canGenerate) => {
                        if (canGenerate) debounceRun(generating, () => generateFinalRoutes());
                    },
                );
            },
            clear: () => {
                useRouterStore.destroy();
            },
        },
        [config],
    );
};
