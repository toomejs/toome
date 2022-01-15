/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-16 05:55:08 +0800
 * @Updated_at     : 2022-01-15 18:32:11 +0800
 * @Path           : /src/utils/store.ts
 * @Description    : 状态管理扩展(基于zustand)
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { createSelectorFunctions, createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce, { Draft } from 'immer';
import { isNil } from 'ramda';
import create, { State, GetState, SetState, StoreApi, UseBoundStore } from 'zustand';

import { subscribeWithSelector } from 'zustand/middleware';

import {
    CreateStore,
    ImmberStateCreator,
    ImmberUseBoundStore,
    ImmerSetState,
    ImmerStoreApi,
    HookSelector,
    StateSelector,
    CreateImmer,
    CreateSubsciber,
    CreateImmberSubsciber,
} from './types';

export const createStore: CreateStore = (createState: any, immber?: boolean) => {
    if (isNil(immber) || immber) return createImmberSubsciber(createState);
    return createSubsciber(createState);
};
/**
 * 创建一个immber store
 * @param createState store创建函数
 */
export const createImmer: CreateImmer = (createState: any) => {
    const store = create(ImmerMiddleware(createState as any));
    store.setState = setImmerState(store.setState);
    return store as any;
};

/**
 * 创建一个可供订阅的store
 * @param createState store创建函数
 */
export const createSubsciber: CreateSubsciber = (createState: any) => {
    return create(subscribeWithSelector(createState as any));
};

/**
 * 创建一个可供订阅的immber store
 * @param createState store创建函数
 */
export const createImmberSubsciber: CreateImmberSubsciber = (createState: any) => {
    const store = create(subscribeWithSelector(ImmerMiddleware(createState as any)));
    store.setState = setImmerState(store.setState) as any;
    return store as any;
};
/**
 * 创建一个store的响应式取值器,可以通过store.use.xxx来获取状态
 * @param store 需要取值的store
 */
export function createSelectors<T extends State, A extends ImmerStoreApi<T>, B extends StoreApi<T>>(
    store: ImmberUseBoundStore<T, A> | UseBoundStore<T, B>,
): StateSelector<T> {
    return createSelectorFunctions(store as any) as any;
}
/**
 * 创建一个store的hooks模式的响应式取值器,可以通过store.useXxx来获取状态
 * @param store 需要取值的store
 */
export function createHookSelectors<
    T extends State,
    A extends ImmerStoreApi<T>,
    B extends StoreApi<T>,
>(store: ImmberUseBoundStore<T, A> | UseBoundStore<T, B>): HookSelector<T> {
    return createSelectorHooks(store as any) as any;
}
/**
 * 扩展默认的状态设置函数为immber设置函数
 * @param set 默认的状态设置函数
 */
const setImmerState =
    <T extends State>(set: SetState<T>): ImmerSetState<T> =>
    (partial, replace) => {
        const nextState =
            typeof partial === 'function'
                ? produce(partial as (state: Draft<T>) => T)
                : (partial as T);
        return set(nextState, replace);
    };

/**
 * 在Immer中间件中重置set函数,使其支持immber
 * @param set
 * @param get
 */
const setImmerStateWithGet = <T extends State>(
    set: SetState<T>,
    get: GetState<T>,
): ImmerSetState<T> => setImmerState(set);

/**
 * 扩展zustand使其支持immber(同时支持`set`和`setState`)
 * @param config 传入中间件的creator
 */
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
