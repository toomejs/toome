import { useCallback, useMemo, useRef } from 'react';

import type { AxiosInstance, AxiosResponse } from 'axios';
import useSWR, { BareFetcher, Key, SWRConfiguration } from 'swr';

import { deepMerge, useStoreSetuped } from '@/utils';

import { useAuthDispatch, useAuthInited, useToken } from '../Auth';

import type { AxiosConfig, FetcherConfig } from './types';
import { FetcherSetuped, FetcherStore } from './store';
import { createRequest } from './utils';

export const useSetupFetcher = (config?: FetcherConfig) => {
    useStoreSetuped({
        store: FetcherSetuped,
        callback: () => {
            FetcherStore.setState((state) => {
                state.axios = config?.axios;
                state.swr = config?.swr;
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
    const setuped = FetcherSetuped((state) => state.setuped);
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

export function useSwrFetcher<
    ResD extends RecordAnyOrNever = RecordAny,
    ReqD extends RecordAnyOrNever = RecordAny,
    Error = any,
>(
    key: Key,
    options?: SWRConfiguration<
        AxiosResponse<ResD, ReqD>,
        Error,
        BareFetcher<AxiosResponse<ResD, ReqD>>
    >,
    config?: AxiosConfig,
) {
    const fetcher = useFetcher(config);
    const getter = useCallback(
        (url: string) => fetcher.get(url).then((res) => res.data),
        [fetcher],
    );
    return useSWR(key, getter, options);
}
