import type { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
    error_message?: boolean;
    cancel_repeat?: boolean;
}
export interface RequestOption {
    token: string | null;
    withToken: boolean;
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
