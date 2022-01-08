import { useCallback } from 'react';

import { useUnmount } from 'react-use';

import { createHookSelectors } from '@/utils';

import { StorageSetup, useStorageDispatch } from '../Storage';

import { useRouterReset } from '../Router/hooks';

import { useFetcherGetter } from '../Fetcher';

import type { User } from './types';
import { AuthStore } from './store';
/**
 * 账户初始化状态
 */
export const useAuthInited = () => useAuth.useInited();
/**
 * 账户状态信息
 */
export const useAuth = createHookSelectors(AuthStore);
/**
 * Token信息
 */
export const useToken = () => useAuth.useToken();
/**
 * 账户的用户信息
 */
export const useUser = <
    T extends RecordAnyOrNever = RecordNever,
    R extends RecordAnyOrNever = RecordNever,
    P extends RecordAnyOrNever = RecordNever,
>() => useAuth.useUser() as User<T, R, P>;

/**
 * 获取非响应式的最新Token状态
 */
export const getToken = () => AuthStore.getState().token;
/**
 * 获取非响应式的最新用户信息状态
 */
export const getUser = () => AuthStore.getState().user;
/**
 * Auth初始化钩子
 * @param api 获取用户信息的api接口地址
 */
export const useSetupAuth = (api?: string) => {
    // 查询器,因为fetcher依赖于Auth的Token状态
    // 所以要用`useFetcherGetter`即使查询器来获取请求实例而不能通过响应式的`useFetter`来获取
    const fetcher = useFetcherGetter();
    const { addTable, getInstance } = useStorageDispatch();
    // 重置Router组件以生成路由
    // Router组件会根据是否依赖Auth的初始化状态(state.inited)来确定是否进行第一次的路由生成
    const resetRouter = useRouterReset();
    // 订阅Storage初始化状态来初始化Auth组件
    const unStorageSub = StorageSetup.subscribe(
        (state) => state.setuped,
        async (setuped) => {
            if (!setuped) return;
            addTable({ name: 'auth' });
            const storage = getInstance('auth');
            if (!storage) return;
            const storgeToken = await storage.getItem<string | null>('token');
            AuthStore.setState((state) => {
                state.token = storgeToken ?? null;
                state.inited = true;
            });
            // 路由没有本地储存的Token,则证明没有登录,所以直接再次生成路由
            // 如果有Token则通过下面的订阅Token函数来等用户信息请求到后再生成路由
            if (!storgeToken) {
                await storage.setItem('token', null);
                resetRouter();
            } else {
                await storage.setItem('token', storgeToken);
            }
        },
    );
    /**
     * 订阅Token的改变来获取并设置最新的账户信息
     */
    const unAuthSub = AuthStore.subscribe(
        (state) => state.token,
        async (token) => {
            if (!token || !api) return;
            try {
                const { data } = await fetcher().get(api);
                if (data) {
                    AuthStore.setState((state) => {
                        state.user = data;
                    });
                }
            } catch (error) {
                AuthStore.setState((state) => {
                    state.user = null;
                });
            }
            // 初始化账户信息无论成功与否都直接生成路由
            resetRouter();
        },
    );
    /**
     * 组件卸载后取消状态订阅
     */
    useUnmount(() => {
        unStorageSub();
        unAuthSub();
    });
};
/**
 * Auth状态操作集
 */
export const useAuthDispatch = () => {
    const { getInstance } = useStorageDispatch();
    const resetRouter = useRouterReset();
    const setToken = useCallback(
        /**
         * 设置新的Token,会自动根据Token的改变获取新的账户信息并刷新路由
         * @param value 新的Token值
         */
        async (value: string) => {
            if (!AuthStore.getState().inited) return;
            AuthStore.setState((state) => {
                state.inited = false;
            });
            const storage = getInstance('auth');
            if (!storage) return;
            await storage.setItem('token', value);
            AuthStore.setState((state) => {
                state.token = value;
                state.inited = true;
            });
        },
        [],
    );
    const clearToken = useCallback(
        /**
         * 清除Token并注销账户
         */
        async () => {
            if (!AuthStore.getState().inited) return;
            AuthStore.setState((state) => {
                state.inited = false;
            });
            const storage = getInstance('auth');
            if (!storage) return;
            await storage.setItem('token', null);
            AuthStore.setState((state) => {
                state.token = null;
                state.user = null;
                state.inited = true;
            });
            // 刷新路由
            resetRouter();
        },
        [],
    );
    return { setToken, clearToken };
};
