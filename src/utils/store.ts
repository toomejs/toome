import { createSelectorFunctions, createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce from 'immer';
import type { Draft } from 'immer';
import type { State, GetState, SetState, StoreApi, UseBoundStore } from 'zustand';

import create from 'zustand';

import type {
    ZSelector,
    ZHookSelector,
    ZImmberStateCreator,
    ZImmberUseBoundStore,
    ZImmerSetState,
    ZImmerStoreApi,
} from './types';

const setImmerState =
    <T extends State>(set: SetState<T>): ZImmerSetState<T> =>
    (partial, replace) => {
        const nextState =
            typeof partial === 'function'
                ? produce(partial as (state: Draft<T>) => T)
                : (partial as T);
        return set(nextState, replace);
    };

const ImmerMiddleware =
    <
        T extends State,
        CustomSetState extends SetState<T>,
        CustomGetState extends GetState<T>,
        CustomStoreApi extends StoreApi<T>,
    >(
        config: ZImmberStateCreator<T, ZImmerSetState<T>, CustomGetState, ZImmerStoreApi<T>>,
    ): ZImmberStateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
    (set, get, api) => {
        return config(setImmerState(set), get, { ...api, setState: setImmerState(api.setState) });
    };

export function createImmer<
    TState extends State,
    CustomSetState,
    CustomGetState,
    CustomStoreApi extends ZImmerStoreApi<TState>,
>(
    createState:
        | ZImmberStateCreator<TState, CustomSetState, CustomGetState, CustomStoreApi>
        | CustomStoreApi,
): ZImmberUseBoundStore<TState, CustomStoreApi>;

export function createImmer<TState extends State>(
    createState:
        | ZImmberStateCreator<TState, SetState<TState>, GetState<TState>, any>
        | ZImmerStoreApi<TState>,
): ZImmberUseBoundStore<TState, ZImmerStoreApi<TState>>;

export function createImmer(createState: any) {
    const store = create(ImmerMiddleware(createState));
    store.setState = setImmerState(store.setState);
    return store;
}

export function createSelectors<
    TState extends State,
    CustomStoreApi extends ZImmerStoreApi<TState>,
>(store: ZImmberUseBoundStore<TState, CustomStoreApi>): ZHookSelector<TState>;
export function createSelectors<TState extends State>(
    store: ZImmberUseBoundStore<TState, ZImmerStoreApi<TState>>,
): ZSelector<TState>;
export function createSelectors<TState extends State, CustomStoreApi extends StoreApi<TState>>(
    store: UseBoundStore<TState, CustomStoreApi>,
): ZSelector<TState>;
export function createSelectors<TState extends State>(
    store: UseBoundStore<TState, StoreApi<TState>>,
): ZSelector<TState>;

export function createSelectors(store: any) {
    return createSelectorFunctions(store) as any;
}

export function createHookSelectors<
    TState extends State,
    CustomStoreApi extends ZImmerStoreApi<TState>,
>(store: ZImmberUseBoundStore<TState, CustomStoreApi>): ZHookSelector<TState>;
export function createHookSelectors<TState extends State>(
    store: ZImmberUseBoundStore<TState, ZImmerStoreApi<TState>>,
): ZHookSelector<TState>;
export function createHookSelectors<TState extends State, CustomStoreApi extends StoreApi<TState>>(
    store: UseBoundStore<TState, CustomStoreApi>,
): ZHookSelector<TState>;
export function createHookSelectors<TState extends State>(
    store: UseBoundStore<TState, StoreApi<TState>>,
): ZHookSelector<TState>;
export function createHookSelectors(store: any) {
    return createSelectorHooks(store) as any;
}
