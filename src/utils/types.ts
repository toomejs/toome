import type { Draft } from 'immer';
import type { EqualityChecker, GetState, State, StateSelector, StoreApi } from 'zustand';

export type ZImmerSetState<T extends State> = (
    partial: ((draft: Draft<T>) => void) | T,
    replace?: boolean,
) => void;
export type ZImmerStoreApi<T extends State> = Omit<StoreApi<T>, 'setState'> & {
    setState: ZImmerSetState<T>;
};
export type ZImmberStateCreator<
    T extends State,
    CustomSetState = ZImmerSetState<T>,
    CustomGetState = GetState<T>,
    CustomStoreApi extends ZImmerStoreApi<T> = ZImmerStoreApi<T>,
> = (set: CustomSetState, get: CustomGetState, api: CustomStoreApi) => T;

export type ZImmberUseBoundStore<
    T extends State,
    CustomStoreApi extends ZImmerStoreApi<T> = ZImmerStoreApi<T>,
> = {
    (): T;
    <U>(selector: StateSelector<T, U>, equalityFn?: EqualityChecker<U>): U;
} & CustomStoreApi;
export type ZSelector<StoreType> = {
    use: {
        [key in keyof StoreType]: () => StoreType[key];
    };
};
export type ZHookSelector<StoreType> = {
    [Key in keyof StoreType as `use${Capitalize<string & Key>}`]: () => StoreType[Key];
};
