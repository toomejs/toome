/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2022-01-10 10:15:17 +0800
 * @Path           : /src/components/Fetcher/types.ts
 * @Description    : Fetcher组件类型
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import type { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { BareFetcher, PublicConfiguration } from 'swr/dist/types';
/**
 * Fetcher配置
 */
export interface FetcherConfig extends AxiosRequestConfig, FetchOption {}
/**
 * swrjs配置
 */
export interface SwrConfig<D = any, E = any>
    extends Partial<PublicConfiguration<D, E, BareFetcher<AxiosResponse<any, any>>>> {}

/**
 * Fetcher组件状态池
 */
export interface FetcherStoreType<D = any, E = any> {
    axios: FetcherConfig;
    swr: SwrConfig<D, E>;
}
/**
 * 自定义选项参数
 */
export interface FetchOption {
    /** 当前账户验证token */
    token?: string | null;
    /** 响应后设置token的函数 */
    setToken?: (token: string) => Promise<void>;
    /** 响应式清除token的函数 */
    clearToken?: () => Promise<void>;
    /** 是否禁止重复请求 */
    cancel_repeat?: boolean;
    /** 自定义axios请求和响应函数 */
    interceptors?: {
        request?: (
            req: AxiosInterceptorManager<AxiosRequestConfig>,
        ) => AxiosInterceptorManager<AxiosRequestConfig>;
        response?: (
            res: AxiosInterceptorManager<AxiosResponse>,
        ) => AxiosInterceptorManager<AxiosResponse>;
    };
}
