import { useCallback, useMemo, useRef } from 'react';

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import useSWR from 'swr';
import type { BareFetcher, SWRConfiguration, SWRResponse } from 'swr';
import { isFunction } from 'lodash-es';

import { deepMerge, useStoreSetuped } from '@/utils';

import { AuthStore, useAuthDispatch, useAuthInited, useToken } from '../Auth';

import type { AxiosConfig, FetcherConfig } from './types';
import { FetcherSetup, FetcherStore } from './store';
import { createRequest } from './utils';

export const useSetupFetcher = (config?: FetcherConfig) => {
    useStoreSetuped({
        store: FetcherSetup,
        callback: () => {
            FetcherStore.setState((state) => {
                state.axios = config?.axios ?? state.axios;
                state.swr = config?.swr ?? state.swr;
            });
        },
    });
};

export function useFetcher(config?: AxiosConfig) {
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
            const instance = createRequest(configs, {
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

export function useFetcherGetter() {
    const { setToken, clearToken } = useAuthDispatch();
    return useCallback((config?: AxiosConfig) => {
        let configs = config;
        if (FetcherSetup.getState().setuped) {
            configs = deepMerge(config ?? {}, FetcherStore.getState().axios ?? {});
        }
        return createRequest(configs, {
            token: AuthStore.getState().token,
            setToken,
            clearToken,
        });
    }, []);
}

type SWRKey<D extends RecordAny> = string | AxiosRequestConfig<D> | [string, AxiosRequestConfig<D>];
export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    K = SWRKey<ResD>,
>(key: K): SWRResponse<ResD, ReqD>;

export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    K = SWRKey<ResD>,
    A = AxiosResponse<ResD, ReqD>,
    E = any,
>(key: K, options: SWRConfiguration<A, E, BareFetcher<A>>): SWRResponse<ResD, ReqD>;

export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    K = SWRKey<ResD>,
>(key: K, getter: BareFetcher<AxiosResponse<ResD, ReqD>>): SWRResponse<ResD, ReqD>;

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
