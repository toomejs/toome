import { useDeepCompareEffect } from 'ahooks';
import type { EffectCallback, DependencyList } from 'react';
import { useRef } from 'react';

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
