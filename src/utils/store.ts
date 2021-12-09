import produce from 'immer';
import type { Draft } from 'immer';
import type { State, GetState, SetState, StoreApi } from 'zustand';

import create from 'zustand';

import type {
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
