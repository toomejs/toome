/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2022-01-10 10:15:27 +0800
 * @Path           : /src/components/Fetcher/utils.ts
 * @Description    : Fetcher工具函数
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import axios, { Canceler } from 'axios';
import type { AxiosRequestConfig, AxiosInstance } from 'axios';

import produce from 'immer';

import { omit, pick } from 'lodash-es';

import { deepMerge } from '@/utils';

import type { FetcherConfig, FetchOption } from './types';

const customOptions: Array<keyof FetchOption> = [
    'token',
    'setToken',
    'interceptors',
    'clearToken',
    'cancel_repeat',
];
/**
 * 创建请求对象
 * @param config Axios配置
 * @param options 自定义选项
 */
export const createRequest: (config?: FetcherConfig) => AxiosInstance = (config) => {
    // 重复请求[key:cancel]映射
    let pendingMap = new Map();
    const configed: AxiosRequestConfig = deepMerge(
        {
            baseURL: '/api/',
            timeout: 10000,
        },
        omit(config, customOptions) ?? {},
    );
    const optioned: FetchOption = deepMerge(
        { token: null, interceptors: {}, cancel_repeat: true },
        pick(config, customOptions) ?? {},
    );
    const instance = axios.create(configed);
    if (optioned.interceptors?.request) {
        optioned.interceptors.request(instance.interceptors.request);
    } else {
        instance.interceptors.request.use(
            (params: AxiosRequestConfig) => {
                // 如果处于请求状态则清除前一次请求
                pendingMap = removePending(params, pendingMap);
                // 如果开启"禁止重复请求"则添加当前请求的取消函数到映射对象
                if (optioned.cancel_repeat) pendingMap = addPending(params, pendingMap);
                // 添加token
                if (optioned.token && typeof window !== 'undefined') {
                    params.headers = { ...(params.headers ?? {}), Authorization: optioned.token };
                }
                return params;
            },
            (error) => {
                if (import.meta.env.DEV) console.log(error);
                return error;
            },
        );
    }
    if (optioned.interceptors?.response) {
        optioned.interceptors.response(instance.interceptors.response);
    } else {
        instance.interceptors.response.use(
            async (response) => {
                const resToken = response.headers.authorization;
                // 如果返回头中带有token并且和当前token不同则储存新的token
                if (resToken && optioned.setToken && optioned.token !== resToken) {
                    await optioned.setToken(resToken);
                }
                // 删除映射对象中的取消函数并结束当前请求
                pendingMap = removePending(response.config, pendingMap);
                return response;
            },
            async (error) => {
                pendingMap = error.config && removePending(error.config, pendingMap);
                if (import.meta.env.DEV) console.log(error);
                switch (error.response.status) {
                    case 401: {
                        if (optioned.token && optioned.clearToken) {
                            await optioned.clearToken();
                        }
                        break;
                    }
                    default:
                        break;
                }
                return Promise.reject(error);
            },
        );
    }

    return instance;
};

/**
 * 生成重复请求控制对象的key
 * @param config axios请求配置
 */
function getPendingKey(config: AxiosRequestConfig): string {
    const { url, method, params } = config;
    let { data } = config;
    if (typeof data === 'string') data = JSON.parse(data);
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}
/**
 * 添加一对重复请求取消函数的key-函数映射
 * @param config axios请求配置
 * @param maps 映射对象
 */
const addPending = (config: AxiosRequestConfig, maps: Map<string, Canceler>) =>
    produce(maps, (state) => {
        const pendingKey = getPendingKey(config);
        const { CancelToken } = axios;
        const source = CancelToken.source();
        if (!config.cancelToken) config.cancelToken = source.token;
        if (!state.has(pendingKey)) state.set(pendingKey, source.cancel);
        return state;
    });
/**
 * 删除一对重复请求取消函数的key-函数映射
 * @param config axios请求配置
 * @param maps 映射对象
 */
const removePending = (config: AxiosRequestConfig, maps: Map<string, Canceler>) =>
    produce(maps, (state) => {
        const pendingKey = getPendingKey(config);
        const cancelToken = state.get(pendingKey);
        if (cancelToken) {
            cancelToken(pendingKey);
            state.delete(pendingKey);
        }
        return state;
    });
