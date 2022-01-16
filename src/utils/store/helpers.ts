import { capitalize } from 'lodash-es';

import { DependencyList } from 'react';
import { useDebounce } from 'react-use';

import { isAsyncFn } from '../helpers';
import { useDeepCompareMemoize } from '../hooks';

import {
    SetupedEffectProps,
    SetupedState,
    StoreHookSelectorCreator,
    StoreSelectorCreator,
} from './types';

/**
 * 用于初始化自定义组件,具有避免重复设置和防抖作用
 * @param 选项
 * @param deps 依赖项(尽量别写而使用zustantd的subscribe代替,否则会导致多次渲染)
 */
export const useStoreSetuped = <T extends SetupedState>(
    { store, callback, clear, wait }: SetupedEffectProps<T>,
    deps: DependencyList = [],
) => {
    const depends = useDeepCompareMemoize(deps);
    useDebounce(
        () => {
            if (
                depends.every((d) => !!d) &&
                !store.getState().created &&
                !store.getState().setuped
            ) {
                store.setState((state: any) => ({ ...state, created: true }));
                if (isAsyncFn(callback)) {
                    callback().then(() => {
                        store.setState((state: any) => ({ ...state, setuped: true }));
                    });
                } else {
                    callback();
                    store.setState((state: any) => ({ ...state, setuped: true }));
                }
            }
            return () => {
                if (clear) clear();
            };
        },
        wait ?? 10,
        depends,
    );
};

/**
 * 创建一个store的响应式取值器,可以通过store.getters.xxx来获取状态
 * @param store 需要取值的store
 */
export const createStoreSelectors: StoreSelectorCreator = (store: any) => {
    store.getters = {};

    Object.keys(store.getState()).forEach((key) => {
        const selector = (state: any) => state[key];
        store.getters[key] = () => store(selector);
    });

    return store;
};
/**
 * 创建一个store的hooks模式的响应式取值器,可以通过store.useXxx来获取状态
 * @param store 需要取值的store
 */
export const createStoreHooks: StoreHookSelectorCreator = (store: any) => {
    (store as any).use = {};

    Object.keys(store.getState()).forEach((key) => {
        const selector = (state: any) => state[key];
        store[`use${capitalize(key)}`] = () => store(selector);
    });
    return store;
};
