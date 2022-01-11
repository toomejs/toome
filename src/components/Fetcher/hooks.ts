/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2022-01-10 10:15:59 +0800
 * @Path           : /src/components/Fetcher/hooks.ts
 * @Description    : Fetcher组件可用钩子
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { useCallback, useMemo, useRef } from 'react';

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import useSWR from 'swr';
import type { BareFetcher, SWRConfiguration, SWRResponse } from 'swr';
import { isFunction } from 'lodash-es';

import { deepMerge, useStoreSetuped } from '@/utils';

import { AuthStore, useAuthDispatch, useAuthInited, useToken } from '../Auth';

import { FetcherConfig, SwrConfig } from './types';
import { FetcherSetup, FetcherStore } from './store';
import { createRequest } from './utils';
/**
 * 初始化Fetcher组件
 * @param config
 */
export const useSetupFetcher = (config?: FetcherConfig, swr?: SwrConfig) => {
    useStoreSetuped({
        store: FetcherSetup,
        callback: () => {
            FetcherStore.setState((state) => {
                state.axios = config ?? state.axios;
                state.swr = swr ?? state.swr;
            });
        },
    });
};
/**
 * 获取一个响应式的fetcher实例
 * @param config 当前fetcher配置
 */
export function useFetcher(config?: FetcherConfig) {
    const { setToken, clearToken } = useAuthDispatch();
    const token = useToken();
    const authed = useAuthInited();
    const setupedRef = useRef<boolean>(false);
    const tokenRef = useRef<string | null>(null);
    const fetcher = useRef<AxiosInstance>();
    const setuped = FetcherSetup((state) => state.setuped);
    return useMemo(() => {
        let configs = config;
        const tokenChanged = authed && tokenRef.current !== token;
        const setupedChanged = setupedRef.current !== setuped;
        if (setupedChanged) {
            configs = deepMerge(config ?? {}, FetcherStore.getState().axios ?? {});
        }
        if (!fetcher.current || tokenChanged || setupedChanged) {
            const instance = createRequest({
                ...configs,
                token,
                setToken,
                clearToken,
            });
            fetcher.current = instance;
            return instance;
        }
        return fetcher.current;
    }, [token, authed, setuped]);
}
/**
 * 获取一个静态的fetcher生成函数
 * 每次执行函数时内部的状态变量都会是最新值
 */
export function useFetcherGetter() {
    const { setToken, clearToken } = useAuthDispatch();
    return useCallback((config?: AxiosRequestConfig) => {
        let configs = config;
        if (FetcherSetup.getState().setuped) {
            configs = deepMerge(config ?? {}, FetcherStore.getState().axios ?? {});
        }
        return createRequest({
            ...configs,
            token: AuthStore.getState().token,
            setToken,
            clearToken,
        });
    }, []);
}
/**
 * SWR.JS的key参数类型
 */
type SWRKey<D extends RecordAny> = string | AxiosRequestConfig<D> | [string, AxiosRequestConfig<D>];
/**
 * Swr请求
 * @param key 请求地址,将自动缓存为key
 */
export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    K = SWRKey<ResD>,
>(key: K): SWRResponse<ResD, ReqD>;
/**
 * Swr请求
 * @param key 请求地址,将自动缓存为key
 * @param options 选项参数
 */
export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    K = SWRKey<ResD>,
    A = AxiosResponse<ResD, ReqD>,
    E = any,
>(key: K, options: SWRConfiguration<A, E, BareFetcher<A>>): SWRResponse<ResD, ReqD>;
/**
 * Swr请求
 * @param key 请求地址,将自动缓存为key
 * @param getter 自定义fetcher实例
 */
export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    K = SWRKey<ResD>,
>(key: K, getter: BareFetcher<AxiosResponse<ResD, ReqD>>): SWRResponse<ResD, ReqD>;
/**
 * Swr请求
 * @param key 请求地址,将自动缓存为key
 * @param options 选项参数
 * @param getter 自定义fetcher实例
 */
export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    K = SWRKey<ResD>,
    A = AxiosResponse<ResD, ReqD>,
    E = any,
>(
    key: K,
    options: SWRConfiguration<A, E, BareFetcher<A>>,
    getter: BareFetcher<A>,
): SWRResponse<ResD, ReqD>;
/**
 * Swr请求
 * @param key 请求地址,将自动缓存为key
 * @param options 选项参数,如果不设置则使用全局配置的选项
 * @param getter 自定义fetcher实例,如果不设置则使用全局配置的实例
 */
export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    K = SWRKey<ResD>,
    A = AxiosResponse<ResD, ReqD>,
    E = any,
>(
    key: K,
    options?: SWRConfiguration<A, E, BareFetcher<A>> | BareFetcher<A>,
    getter?: BareFetcher<A>,
) {
    let swrGetter: BareFetcher<A> | null = null;
    let swrOptions: SWRConfiguration<A, E, BareFetcher<A>> | undefined;
    if (options) {
        if (isFunction(options)) {
            swrGetter = options;
        } else {
            swrOptions = options;
            swrGetter = getter ?? null;
        }
    }
    return useSWR(key, swrGetter, swrOptions);
}
