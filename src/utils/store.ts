import {
    createSelectorFunctions,
    createSelectorHooks,
} from 'auto-zustand-selectors-hook';
import produce from 'immer';
import type { Draft } from 'immer';
import type {
    State,
    GetState,
    SetState,
    StoreApi,
    UseBoundStore,
    StateCreator,
} from 'zustand';

import create from 'zustand';

import { subscribeWithSelector } from 'zustand/middleware';
import type { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

import type {
    ZSSelector,
    ZSImmberStateCreator,
    ZSImmberUseBoundStore,
    ZSImmerSetState,
    ZSImmerStoreApi,
    ZSHookSelector,
    ZSImmberSelectorStoreApi,
} from './types';

const setImmerState =
    <T extends State>(set: SetState<T>): ZSImmerSetState<T> =>
    (partial, replace) => {
        const nextState =
            typeof partial === 'function'
                ? produce(partial as (state: Draft<T>) => T)
                : (partial as T);
        return set(nextState, replace);
    };
const setImmerStateWithGet = <T extends State>(
    set: SetState<T>,
    get: GetState<T>,
): ZSImmerSetState<T> => setImmerState(set);

const ImmerMiddleware =
    <
        T extends State,
        CS extends SetState<T>,
        CG extends GetState<T>,
        CA extends StoreApi<T>,
    >(
        config: ZSImmberStateCreator<
            T,
            ZSImmerSetState<T>,
            CG,
            ZSImmerStoreApi<T>
        >,
    ): ZSImmberStateCreator<T, CS, CG, CA> =>
    (set, get, api) => {
        return config(setImmerStateWithGet(set, get), get, {
            ...api,
            setState: setImmerState(api.setState),
        });
    };

export function createImmer<T extends State>(
    createState:
        | ZSImmberStateCreator<
              T,
              ZSImmerSetState<T>,
              GetState<T>,
              ZSImmerStoreApi<T>
          >
        | ZSImmerStoreApi<T>,
): ZSImmberUseBoundStore<T, ZSImmerStoreApi<T>> {
    const store = create(ImmerMiddleware(createState as any));
    store.setState = setImmerState(store.setState);
    return store as any;
}

export function createSubsciberImmer<T extends State>(
    createState: ZSImmberStateCreator<
        T,
        ZSImmerSetState<T>,
        GetState<T>,
        ZSImmberSelectorStoreApi<T>
    >,
): ZSImmberUseBoundStore<T, ZSImmberSelectorStoreApi<T>> {
    const store = create(
        subscribeWithSelector(ImmerMiddleware(createState as any)),
    );
    store.setState = setImmerState(store.setState) as any;
    return store as any;
}

export function createSubsciber<T extends State>(
    createState: StateCreator<
        T,
        SetState<T>,
        GetState<T>,
        StoreApiWithSubscribeWithSelector<T>
    >,
): UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>> {
    return create(subscribeWithSelector(createState as any));
}

export function createSelectors<
    T extends State,
    A extends ZSImmerStoreApi<T>,
    B extends StoreApi<T>,
>(store: ZSImmberUseBoundStore<T, A> | UseBoundStore<T, B>): ZSSelector<T> {
    return createSelectorFunctions(store as any) as any;
}

export function createHookSelectors<
    T extends State,
    A extends ZSImmerStoreApi<T>,
    B extends StoreApi<T>,
>(store: ZSImmberUseBoundStore<T, A> | UseBoundStore<T, B>): ZSHookSelector<T> {
    return createSelectorHooks(store as any) as any;
}
