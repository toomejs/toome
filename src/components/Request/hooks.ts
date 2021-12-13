import type { AxiosInstance } from 'axios';

import { useCallback, useRef } from 'react';

import { useToken, useTokenDispatch } from '../Auth';

import { createRequest } from './request';
import type { RequestConfig } from './types';

export function useFetcher() {
    const { setToken, clearToken } = useTokenDispatch();
    const token = useToken.useValue();
    const tokened = useToken.useSetuped();
    const tokenRef = useRef<string | null>(null);
    const instanceRef = useRef<AxiosInstance | null>(null);
    function fetchGetter(): AxiosInstance;
    function fetchGetter(reset: boolean): AxiosInstance;
    function fetchGetter(config: RequestConfig): AxiosInstance;
    function fetchGetter(reset: boolean, config: RequestConfig): AxiosInstance;
    function fetchGetter(reset?: boolean | RequestConfig, config?: RequestConfig) {
        if (!reset && instanceRef.current && tokenRef.current === token && tokened) {
            return instanceRef.current;
        }
        const instance = createRequest(config, {
            withToken: true,
            token,
            setToken,
            clearToken,
        });
        instanceRef.current = instance;
        tokenRef.current = token;
        return instance;
    }
    const getFetcher = useCallback(fetchGetter, [tokened, token]);
    return getFetcher;
}
