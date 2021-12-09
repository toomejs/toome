import { useAsyncEffect } from 'ahooks';

import { dequal } from 'dequal';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createImmer } from '@/utils/store';

import { useRequest } from '../Request';
import { useStorage, useStorageInit, useStorageMutation } from '../Storage';

import type { Auth, User } from './types';

const useAuthStore = createImmer<Auth>(() => ({ token: null }));
const useAuthSetupStore = createImmer<{ setuped: boolean }>(() => ({ setuped: false }));
export const useUserStore = createImmer<{ user: User | null; requested: boolean }>(() => ({
    user: null,
    requested: false,
}));
export const useSetupAuth = () => {
    const { addTable } = useStorageMutation();
    const { getInstance } = useStorage();
    const storageInited = useStorageInit();
    const inited = useRef<boolean>(false);
    useAsyncEffect(async () => {
        if (!inited.current && storageInited) {
            addTable({ name: 'auth' });
            const storage = getInstance('auth');
            if (storage) {
                const storgeToken = await storage.getItem<string | null>('token');
                if (!storgeToken) await storage.setItem('token', null);
                else await storage.setItem('token', storgeToken);
                useAuthStore.setState((state) => {
                    state.token = storgeToken ?? null;
                });
                useAuthSetupStore.setState((state) => {
                    state.setuped = true;
                });
            }
            inited.current = true;
        }
    }, [storageInited]);
};
export const useAuth = () => {
    const { getInstance } = useStorage();
    const token = useAuthStore((state) => state.token);
    const setToken = useCallback(async (value: string) => {
        const storage = getInstance('auth');
        if (storage) await storage.setItem('token', value);
        useAuthStore.setState((draft) => {
            draft.token = value;
        });
    }, []);
    const clearToken = useCallback(async () => {
        const storage = getInstance('auth');
        if (storage) await storage.setItem('token', null);
        useAuthStore.setState((draft) => {
            draft.token = null;
        });
    }, []);

    return {
        setuped: useAuthSetupStore((state) => state.setuped),
        token: useMemo(() => token, [token]),
        setToken,
        clearToken,
    };
};
export const useSetupUser = (accout_api?: string) => {
    useSetupAuth();
    const { token } = useAuth();
    const { getAuthRequest } = useRequest();
    const [api, setApi] = useState<string | undefined>();
    useEffect(() => {
        if (accout_api !== undefined) setApi(accout_api);
    }, [accout_api]);
    useAsyncEffect(async () => {
        if (token && api) {
            const request = getAuthRequest();
            if (request) {
                try {
                    const { data } = await request.get(api);
                    if (data) {
                        useUserStore.setState((draft) => {
                            draft.user = data;
                            draft.requested = true;
                        });
                    }
                } catch (error) {
                    console.log(error);
                    useUserStore.setState((draft) => {
                        draft.user = null;
                        draft.requested = true;
                    });
                }
            }
        }
    }, [api, token]);
};
export const useUser = <
    T extends Record<string, any> = Record<string, any>,
    P extends Record<string, any> = Record<string, any>,
>() => {
    const requested = useUserStore((state) => state.requested);
    const user = useUserStore((state) => state.user) as User<T, P>;
    const [changed, setChanged] = useState<boolean>(false);
    const userRef = useRef<User | null>(user);
    useEffect(() => {
        setChanged(!dequal(userRef.current, user));
    }, [user]);
    return {
        requested,
        user,
        changed: useMemo(() => changed, [changed]),
    };
};
