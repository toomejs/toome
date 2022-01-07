import type { Draft } from 'immer';
import type {
    EqualityChecker,
    GetState,
    State,
    StateListener,
    StateSelector as ZSSelector,
    StateSliceListener,
    StoreApi,
    UseBoundStore,
} from 'zustand';

import type { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

/** ********************** zustand *************************** */
export type ImmerSetState<T extends State> = (
    partial: ((draft: Draft<T>) => void) | T,
    replace?: boolean,
) => void;
export type ImmerStoreApi<T extends State> = Omit<StoreApi<T>, 'setState'> & {
    setState: ImmerSetState<T>;
};
export type ImmberSelectorStoreApi<T extends State> = Omit<ImmerStoreApi<T>, 'subscribe'> & {
    subscribe: {
        (listener: StateListener<T>): () => void;
        <StateSlice>(
            selector: ZSSelector<T, StateSlice>,
            listener: StateSliceListener<StateSlice>,
            options?: {
                equalityFn?: EqualityChecker<StateSlice>;
                fireImmediately?: boolean;
            },
        ): () => void;
    };
};
export type ImmberStateCreator<
    T extends State,
    CustomSetState = ImmerSetState<T>,
    CustomGetState = GetState<T>,
    CustomStoreApi extends ImmerStoreApi<T> = ImmerStoreApi<T>,
> = (set: CustomSetState, get: CustomGetState, api: CustomStoreApi) => T;

export type ImmberUseBoundStore<
    T extends State,
    CustomStoreApi extends ImmerStoreApi<T> = ImmerStoreApi<T>,
> = {
    (): T;
    <U>(selector: ZSSelector<T, U>, equalityFn?: EqualityChecker<U>): U;
} & CustomStoreApi;
export type StateSelector<StoreType> = {
    use: {
        [key in keyof StoreType]: () => StoreType[key];
    };
};
export type HookSelector<StoreType> = {
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

export type SetupedEffectProps<T extends SetupedState> = {
    store: UseBoundStore<T> | ImmberUseBoundStore<T> | SubsciberDebounceStore<T>;
    callback: () => void | Promise<void>;
    clear?: () => any;
    wait?: number;
};
export type SubsciberDebounceStore<T extends State> =
    | UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>>
    | ImmberUseBoundStore<T, ImmberSelectorStoreApi<T>>;
export type SubsciberDebounceProps<T extends State, K extends keyof T> = {
    store: SubsciberDebounceStore<T>;
    select: string;
    callback: (current: T[K], pre?: T[K]) => void | Promise<void>;
    wait?: number;
};
