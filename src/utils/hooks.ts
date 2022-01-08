/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2022-01-08 12:39:33 +0800
 * @Updated_at     : 2022-01-08 14:20:36 +0800
 * @Path           : /src/utils/hooks.ts
 * @Description    : Hooks集合
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import {
    MutableRefObject,
    EffectCallback,
    DependencyList,
    useEffect,
    useState,
    useMemo,
    useRef,
} from 'react';
import { useDebounce, useMedia, useUpdateEffect } from 'react-use';

import { useDeepCompareEffect } from 'ahooks';

import { dequal } from 'dequal';

import { isAsyncFn } from './helpers';
import { SetupedEffectProps, SetupedState } from './types';

/** ******************************  设备相关 ********************************** */

/**
 * 通过响应式检测是否为移动设备屏幕
 */
export const useResponsiveMobileCheck = () => {
    const responsive = useMedia('(max-width: 575px)');
    const [isMobile, setMobile] = useState(responsive);
    useUpdateEffect(() => {
        setMobile(responsive);
    }, [responsive]);
    return isMobile;
};

/**
 * 防抖执行函数,在一段时间内只执行一次
 * @param ref 对比控制值
 * @param fn 执行的函数,可为异步
 * @param wait 间隔时间
 */
export const debounceRun = (
    ref: MutableRefObject<true | undefined>,
    fn: (...args: any[]) => any,
    wait?: number,
) => {
    if (!ref.current) {
        ref.current = true;
        setTimeout(() => {
            if (isAsyncFn(fn)) {
                fn().then(() => {
                    ref.current = undefined;
                });
            } else {
                fn();
                ref.current = undefined;
            }
        }, wait ?? 10);
    }
};

/** ****************************** 状态管理  ********************************** */

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

/** ****************************** 生命周期 ********************************** */

/**
 * 异步执行的深度依赖检测Effect钩子
 * @param effect 需要执行的函数
 * @param deps 依赖项
 */
export const useAsyncDeepCompareEffect = (
    effect: () => AsyncGenerator<void, void, void> | Promise<void>,
    deps: DependencyList,
) => {
    useDeepCompareEffect(() => {
        (async () => {
            await effect();
        })();
    }, deps);
};

/**
 * 当所有依赖项改变时才执行函数的Effect钩子
 * @param effect 需要执行的函数
 * @param deps 依赖项
 * @param deep 是否深度对比
 */
export function useEffectAll(effect: EffectCallback, deps: DependencyList, deep = false) {
    const prevDeps = useDiff(deps);
    const changeTarget = useRef<DependencyList>();
    // eslint-disable-next-line consistent-return
    useDeepCompareEffect(() => {
        if (changeTarget.current === undefined) {
            changeTarget.current = prevDeps;
        }
        if (changeTarget.current === undefined) {
            return effect();
        }
        if (
            changeTarget.current.every((dep, i) => (deep ? !dequal(dep, deps[i]) : dep !== deps[i]))
        ) {
            changeTarget.current = deps;
            return effect();
        }
    }, [effect, prevDeps, deps]);
}

/**
 * 与useEffectAll类似,但是是异步钩子,因此无返回值
 * @param effect 需要执行的函数
 * @param deps 依赖项
 * @param deep 是否深度对比
 */
export function useAsyncEffectAll(
    effect: () => AsyncGenerator<void, void, void> | Promise<void>,
    deps: DependencyList,
    deep = false,
) {
    const prevDeps = useDiff(deps);
    const changeTarget = useRef<DependencyList>();
    useDeepCompareEffect(() => {
        (async () => {
            if (changeTarget.current === undefined) {
                changeTarget.current = prevDeps;
            }
            if (changeTarget.current === undefined) {
                effect();
            } else if (
                changeTarget.current.every((dep, i) =>
                    deep ? !dequal(dep, deps[i]) : dep !== deps[i],
                )
            ) {
                changeTarget.current = deps;
                effect();
            }
        })();
    }, [effect, prevDeps, deps]);
}

/**
 * ahooks和react-use的`useUpdateEffect`的深度对比版本
 * @param effect 需要执行的函数
 * @param deps 依赖项
 */
export const useDeepCompareUpdateEffect = (effect: EffectCallback, deps: DependencyList) => {
    const isFirst = useRef(true);

    // eslint-disable-next-line consistent-return
    useDeepCompareEffect(() => {
        if (!isFirst.current) {
            return effect();
        }
        isFirst.current = false;
    }, deps);
};

/** ******************************  缓存与记忆 ********************************** */
/**
 * 返回上一次的值
 * @param deps 依赖项
 */
export const useDiff = (deps: DependencyList) => {
    const ref = useRef<DependencyList>();

    useEffect(() => {
        ref.current = deps;
    }, [deps]);

    return ref.current;
};

/**
 * 用于深度检测依赖的useMemo钩子
 * @param factory 返回值
 * @param dependencies 依赖项
 */
export function useDeepCompareMemo<T>(factory: () => T, dependencies: DependencyList) {
    return useMemo(factory, useDeepCompareMemoize(dependencies));
}

/**
 * 深度检测依赖值是否改变
 * @param deps 依赖项
 */
const useDeepCompareMemoize = (deps: DependencyList) => {
    const ref = useRef<DependencyList>([]);

    if (!dequal(deps, ref.current)) {
        ref.current = deps;
    }

    return ref.current;
};
