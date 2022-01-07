import type { DependencyList, MutableRefObject } from 'react';
import { useDebounce } from 'react-use';

import { isAsyncFn } from './helpers';
import { useDeepCompareMemoize } from './memoize';
import type { SetupedEffectProps, SetupedState } from './types';

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

export function useStoreSetuped<T extends SetupedState>(
    { store, callback, clear, wait }: SetupedEffectProps<T>,
    deps: DependencyList = [],
) {
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
}
