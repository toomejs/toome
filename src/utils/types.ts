import type { Draft } from 'immer';
import type {
    EqualityChecker,
    GetState,
    State,
    StateListener,
    StateSelector,
    StateSliceListener,
    StoreApi,
    UseBoundStore,
} from 'zustand';

import type { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

/** ********************** zustand *************************** */
export type ZSImmerSetState<T extends State> = (
    partial: ((draft: Draft<T>) => void) | T,
    replace?: boolean,
) => void;
export type ZSImmerStoreApi<T extends State> = Omit<StoreApi<T>, 'setState'> & {
    setState: ZSImmerSetState<T>;
};
export type ZSImmberSelectorStoreApi<T extends State> = Omit<ZSImmerStoreApi<T>, 'subscribe'> & {
    subscribe: {
        (listener: StateListener<T>): () => void;
        <StateSlice>(
            selector: StateSelector<T, StateSlice>,
            listener: StateSliceListener<StateSlice>,
            options?: {
                equalityFn?: EqualityChecker<StateSlice>;
                fireImmediately?: boolean;
            },
        ): () => void;
    };
};
export type ZSImmberStateCreator<
    T extends State,
    CustomSetState = ZSImmerSetState<T>,
    CustomGetState = GetState<T>,
    CustomStoreApi extends ZSImmerStoreApi<T> = ZSImmerStoreApi<T>,
> = (set: CustomSetState, get: CustomGetState, api: CustomStoreApi) => T;

export type ZSImmberUseBoundStore<
    T extends State,
    CustomStoreApi extends ZSImmerStoreApi<T> = ZSImmerStoreApi<T>,
> = {
    (): T;
    <U>(selector: StateSelector<T, U>, equalityFn?: EqualityChecker<U>): U;
} & CustomStoreApi;
export type ZSSelector<StoreType> = {
    use: {
        [key in keyof StoreType]: () => StoreType[key];
    };
};
export type ZSHookSelector<StoreType> = {
    [Key in keyof StoreType as `use${Capitalize<string & Key>}`]: () => StoreType[Key];
};

/** ********************** debounce *************************** */
export type SetupByDepProps<T extends RecordAny> = {
    action: (config?: T) => void;
    config?: T;
};

export type SetupedState<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    { created?: true; setuped?: true },
    T
>;
export type SetupedStore<T extends RecordAnyOrNever = RecordNever> = UseBoundStore<
    { created?: true; setuped?: true } & T,
    StoreApi<{ created?: true; setuped?: true } & T>
>;
export type SetupedEffectProps<T extends RecordAnyOrNever = RecordNever> = {
    store: SetupedStore<T>;
    callback: () => void | Promise<void>;
    clear?: () => any;
    wait?: number;
};
export type SubsciberDebounceStore<T extends State> =
    | UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>>
    | ZSImmberUseBoundStore<T, ZSImmberSelectorStoreApi<T>>;
export type SubsciberDebounceProps<T extends State, K extends keyof T> = {
    store: SubsciberDebounceStore<T>;
    select: string;
    callback: (current: T[K], pre?: T[K]) => void | Promise<void>;
    wait?: number;
};
