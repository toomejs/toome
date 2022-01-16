import { Draft } from 'immer';
import {
    EqualityChecker,
    State,
    StoreApi,
    StateSelector as ZSSelector,
    GetState,
    StateListener,
    StateSliceListener,
    SetState,
    UseBoundStore,
} from 'zustand';
import { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';
/** ***********************  store   *********************** */
export interface StoreCreator {
    <
        T extends State,
        CustomSetState extends ImmerSetState<T>,
        CustomGetState,
        CustomStoreApi extends ImmerSelectorStoreApi<T>,
    >(
        createState:
            | ImmberStateCreator<T, CustomSetState, CustomGetState, CustomStoreApi>
            | CustomStoreApi,
        devtools?: boolean,
    ): ImmberUseBoundStore<T, CustomStoreApi>;

    <T extends State>(
        createState: ImmberStateCreator<T, ImmerSetState<T>, GetState<T>, ImmerSelectorStoreApi<T>>,
        devtools?: boolean,
    ): ImmberUseBoundStore<T, ImmerSelectorStoreApi<T>>;
}
export interface ReduxStoreCreator {
    <
        T extends State,
        A extends {
            type: unknown;
        },
        CustomStoreApi extends ImmerSelectorStoreApiWithReudx<T, A>,
    >(
        reducer: (state: T, action: A) => T,
        initial: T,
        devtools?: boolean,
    ): ImmberReduxUseBoundStore<T, A, CustomStoreApi>;
    <
        T extends State,
        A extends {
            type: unknown;
        },
    >(
        reducer: (state: T, action: A) => T,
        initial: T,
        devtools?: boolean,
    ): ImmberReduxUseBoundStore<T, A, ImmerSelectorStoreApiWithReudx<T, A>>;
}

/** ***********************   utils   *********************** */

export interface ImmerStateSetterWithGet {
    <T extends State>(set: SetState<T>, get: GetState<T>): ImmerSetState<T>;
}
/**
 * 组件初始化钩子的状态类型
 */
export type SetupedState<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        /** 初始化钩子是否已经开始执行 */
        created?: true;
        /** 是否已经初始化 */
        setuped?: true;
    },
    T
>;
/**
 * 组件初始化钩子的选项参数类型
 */
export type SetupedEffectProps<T extends SetupedState> = {
    /** 生成的用于管理初始化状态的zustand store */
    store: UseBoundStore<T> | ImmberUseBoundStore<T> | SubsciberDebounceStore<T>;
    /** 初始化时执行的函数 */
    callback: () => void | Promise<void>;
    /** 卸载组件时的清理函数 */
    clear?: () => any;
    /** 初始化函数调用间隔时间,可防止多次初始化 */
    wait?: number;
};
export interface StoreSelectorCreator {
    <T extends State, A extends ImmerStoreApi<T>, B extends StoreApi<T>>(
        store: ImmberUseBoundStore<T, A> | UseBoundStore<T, B>,
    ): StoreSelector<T>;
}
export interface StoreHookSelectorCreator {
    <T extends State, A extends ImmerStoreApi<T>, B extends StoreApi<T>>(
        store: ImmberUseBoundStore<T, A> | UseBoundStore<T, B>,
    ): StoreHookSelector<T>;
}

/**
 * 可供订阅的zustand store类型
 */
type SubsciberDebounceStore<T extends State> =
    | UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>>
    | ImmberUseBoundStore<T, ImmerSelectorStoreApi<T>>;

type StoreSelector<T extends State> = {
    getters: {
        [key in keyof T]: () => T[key];
    };
};
/**
 * 类hooks的状态选择器
 */
type StoreHookSelector<StoreType> = {
    [Key in keyof StoreType as `use${Capitalize<string & Key>}`]: () => StoreType[Key];
};

/** ***********************  类型补丁(中间件,返回值等)   *********************** */
/**
 * immer store类型
 */
type ImmberUseBoundStore<
    T extends State,
    CustomStoreApi extends ImmerStoreApi<T> = ImmerStoreApi<T>,
> = {
    (): T;
    <U>(selector: ZSSelector<T, U>, equalityFn?: EqualityChecker<U>): U;
} & CustomStoreApi;

/**
 * immer store创建器
 */
export type ImmberStateCreator<
    T extends State,
    CustomSetState = ImmerSetState<T>,
    CustomGetState = GetState<T>,
    CustomStoreApi extends ImmerStoreApi<T> = ImmerStoreApi<T>,
> = (set: CustomSetState, get: CustomGetState, api: CustomStoreApi) => T;

/**
 * 支持immber的store的`set`函数类型
 */
type ImmerSetState<T extends State> = (
    /** 传入的状态设置函数 */
    partial: ((state: Draft<T>) => void) | T,
    /** 是否完全替换现有状态 */
    replace?: boolean,
) => void;
/**
 * 支持immer的store api
 */
type ImmerStoreApi<T extends State> = Omit<StoreApi<T>, 'setState'> & {
    /** 使用immber来设置状态 */
    setState: ImmerSetState<T>;
};

/**
 * 支持immer和选择器功能的store api
 */
export type ImmerSelectorStoreApi<T extends State> = Omit<ImmerStoreApi<T>, 'subscribe'> & {
    subscribe: {
        (listener: StateListener<T>): () => void;
        <StateSlice>(
            selector: ZSSelector<T, StateSlice>,
            listener: StateSliceListener<StateSlice>,
            options?: {
                /** 比较函数(默认深度比较,为了性能需要,对于一些直接数据可以使用`shallow`进行浅比较) */
                equalityFn?: EqualityChecker<StateSlice>;
                /** 是否订阅后立即执行(设置为`false`,则第一次不执行) */
                fireImmediately?: boolean;
            },
        ): () => void;
    };
};
export interface ImmerStoreMiddlewareType {
    <T extends State, CS extends SetState<T>, CG extends GetState<T>, CA extends StoreApi<T>>(
        config: ImmberStateCreator<T, ImmerSetState<T>, CG, ImmerStoreApi<T>>,
    ): ImmberStateCreator<T, CS, CG, CA>;
}
export interface SetImmberState {
    <T extends State>(set: SetState<T>): ImmerSetState<T>;
}

type ImmberReduxUseBoundStore<
    T extends State,
    A extends {
        type: unknown;
    },
    CustomStoreApi extends ImmerSelectorStoreApiWithReudx<T, A> = ImmerSelectorStoreApiWithReudx<
        T,
        A
    >,
> = {
    (): T;
    <U>(selector: ZSSelector<T, U>, equalityFn?: EqualityChecker<U>): U;
} & CustomStoreApi;
type DevtoolsType = {
    prefix: string;
    subscribe: (dispatch: any) => () => void;
    unsubscribe: () => void;
    send: (action: string, state: any) => void;
    init: (state: any) => void;
    error: (payload: any) => void;
};
/**
 * 支持immer和选择器功能的store api
 */
type ImmerSelectorStoreApiWithReudx<
    T extends State,
    A extends {
        type: unknown;
    },
> = Omit<ImmerReduxStoreApi<T, A>, 'subscribe'> & {
    subscribe: {
        (
            listener: StateListener<
                T & {
                    dispatch: (a: A) => A;
                }
            >,
        ): () => void;
        <StateSlice>(
            selector: ZSSelector<
                T & {
                    dispatch: (a: A) => A;
                },
                StateSlice
            >,
            listener: StateSliceListener<StateSlice>,
            options?: {
                /** 比较函数(默认深度比较,为了性能需要,对于一些直接数据可以使用`shallow`进行浅比较) */
                equalityFn?: EqualityChecker<StateSlice>;
                /** 是否订阅后立即执行(设置为`false`,则第一次不执行) */
                fireImmediately?: boolean;
            },
        ): () => void;
    };
};

type ImmerReduxStoreApi<
    T extends State,
    A extends {
        type: unknown;
    },
> = ImmerStoreApi<
    T & {
        dispatch: (a: A) => A;
    }
> & {
    dispatch: (a: A) => A;
    dispatchFromDevtools: boolean;
    devtools?: DevtoolsType;
};
