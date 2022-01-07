import { createSelectorFunctions, createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce from 'immer';
import type { Draft } from 'immer';
import type { State, GetState, SetState, StoreApi, UseBoundStore, StateCreator } from 'zustand';

import create from 'zustand';

import { subscribeWithSelector } from 'zustand/middleware';
import type { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

import type {
    ImmberStateCreator,
    ImmberUseBoundStore,
    ImmerSetState,
    ImmerStoreApi,
    HookSelector,
    ImmberSelectorStoreApi,
    StateSelector,
} from './types';

const setImmerState =
    <T extends State>(set: SetState<T>): ImmerSetState<T> =>
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
): ImmerSetState<T> => setImmerState(set);

const ImmerMiddleware =
    <T extends State, CS extends SetState<T>, CG extends GetState<T>, CA extends StoreApi<T>>(
        config: ImmberStateCreator<T, ImmerSetState<T>, CG, ImmerStoreApi<T>>,
    ): ImmberStateCreator<T, CS, CG, CA> =>
    (set, get, api) => {
        return config(setImmerStateWithGet(set, get), get, {
            ...api,
            setState: setImmerState(api.setState),
        });
    };

export function createImmer<T extends State>(
    createState:
        | ImmberStateCreator<T, ImmerSetState<T>, GetState<T>, ImmerStoreApi<T>>
        | ImmerStoreApi<T>,
): ImmberUseBoundStore<T, ImmerStoreApi<T>> {
    const store = create(ImmerMiddleware(createState as any));
    store.setState = setImmerState(store.setState);
    return store as any;
}

export function createSubsciberImmer<T extends State>(
    createState: ImmberStateCreator<T, ImmerSetState<T>, GetState<T>, ImmberSelectorStoreApi<T>>,
): ImmberUseBoundStore<T, ImmberSelectorStoreApi<T>> {
    const store = create(subscribeWithSelector(ImmerMiddleware(createState as any)));
    store.setState = setImmerState(store.setState) as any;
    return store as any;
}

export function createSubsciber<T extends State>(
    createState: StateCreator<T, SetState<T>, GetState<T>, StoreApiWithSubscribeWithSelector<T>>,
): UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>> {
    return create(subscribeWithSelector(createState as any));
}

export function createSelectors<T extends State, A extends ImmerStoreApi<T>, B extends StoreApi<T>>(
    store: ImmberUseBoundStore<T, A> | UseBoundStore<T, B>,
): StateSelector<T> {
    return createSelectorFunctions(store as any) as any;
}

export function createHookSelectors<
    T extends State,
    A extends ImmerStoreApi<T>,
    B extends StoreApi<T>,
>(store: ImmberUseBoundStore<T, A> | UseBoundStore<T, B>): HookSelector<T> {
    return createSelectorHooks(store as any) as any;
}
