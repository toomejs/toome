import { useDebounceEffect, useDeepCompareEffect } from 'ahooks';
import { EffectCallback, DependencyList, useRef } from 'react';
import type { State } from 'zustand';

import { isAsyncFn } from '@/utils/tools';

import type { SetupedEffectProps, SubsciberDebounceProps } from './types';

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

export function useEffectAll(effect: EffectCallback, deps: DependencyList) {
    const prevDeps = usePrevious(deps);
    const changeTarget = useRef<DependencyList>();
    // eslint-disable-next-line consistent-return
    useDeepCompareEffect(() => {
        if (changeTarget.current === undefined) {
            changeTarget.current = prevDeps;
        }
        if (changeTarget.current === undefined) {
            return effect();
        }
        if (changeTarget.current.every((dep, i) => dep !== deps[i])) {
            changeTarget.current = deps;
            return effect();
        }
    }, [effect, prevDeps, deps]);
}

export function useAsyncEffectAll(
    effect: () => AsyncGenerator<void, void, void> | Promise<void>,
    deps: DependencyList,
) {
    const prevDeps = usePrevious(deps);
    const changeTarget = useRef<DependencyList>();
    useDeepCompareEffect(() => {
        (async () => {
            if (changeTarget.current === undefined) {
                changeTarget.current = prevDeps;
            }
            if (changeTarget.current === undefined) {
                effect();
            } else if (changeTarget.current.every((dep, i) => dep !== deps[i])) {
                changeTarget.current = deps;
                effect();
            }
        })();
    }, [effect, prevDeps, deps]);
}
// taken from https://usehooks.com/usePrevious/
function usePrevious(value: DependencyList) {
    const ref = useRef<DependencyList>();

    useDeepCompareEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

export function useSetupedEffect<T extends RecordAnyOrNever>(
    { store, callback, wait }: SetupedEffectProps<T>,
    deps?: DependencyList,
) {
    const depends = deps ?? [];

    useDebounceEffect(
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
                    store.setState((state: any) => ({ ...state, setuped: true }));
                }
            }
        },
        [depends],
        { wait: wait ?? 10 },
    );
}

export function useSubsciberDebounce<T extends State, K extends keyof T>(
    { store, select, callback, wait }: SubsciberDebounceProps<T, K>,
    deps?: DependencyList,
) {
    const changing = useRef<boolean>(false);
    store.subscribe(
        (state) => state[select],
        (current, pre) => {
            if (!changing.current) {
                changing.current = true;
                const value = store.getState()[select];
                if (isAsyncFn(callback)) {
                    callback(value).then(() => {
                        changing.current = false;
                    });
                } else {
                    callback(value);
                    changing.current = false;
                }
            }
        },
    );
}
