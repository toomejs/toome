import { dequal } from 'dequal';
import { useMemo, useRef } from 'react';
import type { DependencyList } from 'react';

function useDeepCompareMemoize(value: DependencyList) {
    const ref = useRef<DependencyList>([]);

    if (!dequal(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
}

export function useDeepCompareMemo<T>(factory: () => T, dependencies: DependencyList) {
    return useMemo(factory, useDeepCompareMemoize(dependencies));
}
