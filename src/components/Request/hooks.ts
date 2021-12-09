import type { AxiosInstance } from 'axios';

import { useCallback, useRef } from 'react';

import { useAuth } from '@/components/Auth/hooks';

import { createRequest } from './request';
import type { RequestConfig } from './types';

export function useRequest() {
    // const { setuped: authInited, token, setToken, clearToken } = useAuth();
    const { token, setToken, clearToken } = useAuth();
    const ref = useRef<AxiosInstance | null>(null);
    const authRef = useRef<AxiosInstance | null>(null);
    const getRequest = useCallback((config?: RequestConfig, reCreate?: boolean) => {
        if (reCreate || !ref.current) {
            const instance = createRequest(config, {
                withToken: false,
            });
            ref.current = instance;
            return instance;
        }
        return ref.current;
    }, []);
    const getAuthRequest = useCallback(
        (config?: RequestConfig, reCreate?: boolean) => {
            if (!reCreate && authRef.current) return authRef.current;
            if (!token) {
                // if (!authInited || (authInited && !token)) {
                authRef.current = null;
                return null;
            }
            const instance = createRequest(config, {
                withToken: true,
                token,
                setToken,
                clearToken,
            });
            authRef.current = instance;
            return instance;
        },
        [token],
    );
    return { getRequest, getAuthRequest };
}
