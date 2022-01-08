/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-16 05:55:08 +0800
 * @Updated_at     : 2022-01-08 17:21:47 +0800
 * @Path           : /src/utils/types.ts
 * @Description    : 所有Utils的类型
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { Draft } from 'immer';
import {
    EqualityChecker,
    GetState,
    State,
    StateListener,
    StateSelector as ZSSelector,
    StateSliceListener,
    StoreApi,
    UseBoundStore,
} from 'zustand';

import { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

/** ********************** zustand *************************** */
/**
 * 支持immber的store的`set`函数类型
 */
export type ImmerSetState<T extends State> = (
    /** 传入的状态设置函数 */
    partial: ((state: Draft<T>) => void) | T,
    /** 是否完全替换现有状态 */
    replace?: boolean,
) => void;

/**
 * 支持immer的store api
 */
export type ImmerStoreApi<T extends State> = Omit<StoreApi<T>, 'setState'> & {
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
 * immer store类型
 */
export type ImmberUseBoundStore<
    T extends State,
    CustomStoreApi extends ImmerStoreApi<T> = ImmerStoreApi<T>,
> = {
    (): T;
    <U>(selector: ZSSelector<T, U>, equalityFn?: EqualityChecker<U>): U;
} & CustomStoreApi;

/**
 * 状态选择器
 */
export type StateSelector<T extends State> = {
    use: {
        [key in keyof T]: () => T[key];
    };
};

/**
 * 类hooks的状态选择器
 */
export type HookSelector<StoreType> = {
    [Key in keyof StoreType as `use${Capitalize<string & Key>}`]: () => StoreType[Key];
};

/** ********************** hooks *************************** */

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

/**
 * 可供订阅的zustand store类型
 */
type SubsciberDebounceStore<T extends State> =
    | UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>>
    | ImmberUseBoundStore<T, ImmerSelectorStoreApi<T>>;

// export type SubsciberDebounceProps<T extends State, K extends keyof T> = {
//     store: SubsciberDebounceStore<T>;
//     select: string;
//     callback: (current: T[K], pre?: T[K]) => void | Promise<void>;
//     wait?: number;
// };

// export type SetupByDepProps<T extends RecordAny> = {
//     action: (config?: T) => void;
//     config?: T;
// };
