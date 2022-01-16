import produce from 'immer';
import create from 'zustand';
import { redux, subscribeWithSelector, devtools as zsdevtools } from 'zustand/middleware';

import {
    ImmerStateSetterWithGet,
    ImmerStoreMiddlewareType,
    ReduxStoreCreator,
    SetImmberState,
    StoreCreator,
} from './types';

/**
 * 创建一个可供订阅的immber store
 * @param createState store创建函数
 */
export const createStore: StoreCreator = (createState: any, devtools: any) => {
    let store: any = devtools ? zsdevtools(createState) : createState;
    store = create(subscribeWithSelector(ImmerMiddleware(store)));
    store.setState = setImmerState(store.setState) as any;
    return store as any;
};
export const createReduxStore: ReduxStoreCreator = (reducer: any, initial: any, devtools: any) => {
    let store: any = devtools ? zsdevtools(redux(reducer, initial)) : redux(reducer, initial);
    store = create(subscribeWithSelector(ImmerMiddleware(store as any)));
    store.setState = setImmerState(store.setState) as any;
    return store as any;
};
/**
 * 扩展默认的状态设置函数为immber设置函数
 * @param set 默认的状态设置函数
 */
const setImmerState: SetImmberState = (set) => (partial, replace) => {
    const nextState = typeof partial === 'function' ? produce(partial) : partial;
    return set(nextState, replace);
};

/**
 * 在Immer中间件中重置set函数,使其支持immber
 * @param set
 * @param get
 */
const setImmerStateWithGet: ImmerStateSetterWithGet = (set: any, get: any) => setImmerState(set);

/**
 * 扩展zustand使其支持immber(同时支持`set`和`setState`)
 * @param config 传入中间件的creator
 */
const ImmerMiddleware: ImmerStoreMiddlewareType = (config: any) => (set, get, api) => {
    api.setState = setImmerState(api.setState) as any;
    return config(setImmerStateWithGet(set, get), get, api);
};
