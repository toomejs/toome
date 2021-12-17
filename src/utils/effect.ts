import { useDeepCompareEffect } from 'ahooks';
import { dequal } from 'dequal';
import { EffectCallback, DependencyList, useRef, useEffect } from 'react';

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

function useDiff(value: DependencyList) {
    const ref = useRef<DependencyList>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

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
