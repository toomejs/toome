import type { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { BareFetcher, PublicConfiguration } from 'swr/dist/types';

export interface AxiosConfig extends AxiosRequestConfig {
    error_message?: boolean;
    cancel_repeat?: boolean;
}
export interface FetchOption {
    token: string | null;
    setToken?: (token: string) => Promise<void>;
    clearToken?: () => Promise<void>;
    interceptors: {
        request?: (
            req: AxiosInterceptorManager<AxiosRequestConfig>,
        ) => AxiosInterceptorManager<AxiosRequestConfig>;
        response?: (
            res: AxiosInterceptorManager<AxiosResponse>,
        ) => AxiosInterceptorManager<AxiosResponse>;
    };
}
export interface FetcherConfig<D = any, E = any> {
    axios?: AxiosConfig;
    swr?: PublicConfiguration<D, E, BareFetcher<AxiosResponse<any, any>>>;
}
