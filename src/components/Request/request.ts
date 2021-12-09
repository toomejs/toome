import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance } from 'axios';

import produce from 'immer';

import { deepMerge } from '@/utils/tools';

import type { RequestConfig, RequestOption } from './types';

function getPendingKey(config: AxiosRequestConfig) {
    const { url, method, params } = config;
    let { data } = config;
    if (typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}

function addPending(config: AxiosRequestConfig, maps: Map<string, any>) {
    const nmaps = produce(maps, (draft) => draft);
    const pendingKey = getPendingKey(config);
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
            if (!nmaps.has(pendingKey)) {
                nmaps.set(pendingKey, cancel);
            }
        });
    return nmaps;
}

function removePending(config: AxiosRequestConfig, maps: Map<string, any>) {
    const nmaps = produce(maps, (draft) => draft);
    const pendingKey = getPendingKey(config);
    if (nmaps.has(pendingKey)) {
        const cancelToken = nmaps.get(pendingKey);
        cancelToken(pendingKey);
        nmaps.delete(pendingKey);
    }
    return nmaps;
}

export const createRequest: (
    config?: RequestConfig,
    options?: RePartial<RequestOption>,
) => AxiosInstance = (config, options) => {
    let pendingMap = new Map();
    const configed: RequestConfig = deepMerge(
        {
            baseURL: '/api/',
            timeout: 10000,
        },
        config ?? {},
    );
    const optioned: RequestOption = deepMerge(
        { token: null, withToken: false, interceptors: {} },
        options ?? {},
    );
    const instance = axios.create(configed);
    if (optioned.interceptors.request) {
        optioned.interceptors.request(instance.interceptors.request);
    } else {
        instance.interceptors.request.use(
            (params: RequestConfig) => {
                pendingMap = removePending(params, pendingMap);
                if (params.cancel_repeat) {
                    pendingMap = addPending(params, pendingMap);
                }
                if (optioned.withToken && optioned.token && typeof window !== 'undefined') {
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
    if (optioned.interceptors.response) {
        optioned.interceptors.response(instance.interceptors.response);
    } else {
        instance.interceptors.response.use(
            async (response) => {
                if (optioned.withToken) {
                    const resToken = response.headers.authorization;
                    if (resToken && optioned.withToken && optioned.setToken) {
                        await optioned.setToken(resToken);
                    }
                }
                pendingMap = removePending(response.config, pendingMap);
                return response;
            },
            async (error) => {
                pendingMap = error.config && removePending(error.config, pendingMap);
                if (import.meta.env.DEV) console.log(error);
                switch (error.response.status) {
                    case 401: {
                        if (optioned.withToken && optioned.token && optioned.clearToken) {
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
