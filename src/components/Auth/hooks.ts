import { useCallback } from 'react';

import { useUnmount } from 'react-use';

import { createHookSelectors } from '@/utils';

import { StorageSetup, useStorageDispatch } from '../Storage';

import { useRouterReset } from '../Router/hooks';

import { useFetcherGetter } from '../Fetcher';

import type { User } from './types';
import { AuthStore } from './store';

export const useAuth = createHookSelectors(AuthStore);
export const useAuthInited = () => useAuth.useInited();
export const useToken = () => useAuth.useToken();
export const useUser = <
    T extends RecordAnyOrNever = RecordNever,
    R extends RecordAnyOrNever = RecordNever,
    P extends RecordAnyOrNever = RecordNever,
>() => useAuth.useUser() as User<T, R, P>;

export const getToken = () => AuthStore.getState().token;
export const getUser = () => AuthStore.getState().user;
export const useSetupAuth = (api?: string) => {
    const fetcher = useFetcherGetter();
    const { addTable, getInstance } = useStorageDispatch();
    const resetRouter = useRouterReset();
    const unStorageSub = StorageSetup.subscribe(
        (state) => state.setuped,
        async (setuped) => {
            if (!setuped) return;
            addTable({ name: 'auth' });
            const storage = getInstance('auth');
            if (!storage) return;
            const storgeToken = await storage.getItem<string | null>('token');
            AuthStore.setState((state) => {
                state.token = storgeToken ?? null;
                state.inited = true;
            });
            if (!storgeToken) {
                await storage.setItem('token', null);
                resetRouter();
            } else {
                await storage.setItem('token', storgeToken);
            }
        },
    );
    const unAuthSub = AuthStore.subscribe(
        (state) => state.token,
        async (token) => {
            if (!token || !api) return;
            try {
                const { data } = await fetcher().get(api);
                if (data) {
                    AuthStore.setState((state) => {
                        state.user = data;
                    });
                }
            } catch (error) {
                AuthStore.setState((state) => {
                    state.user = null;
                });
            }
            resetRouter();
        },
    );
    useUnmount(() => {
        unStorageSub();
        unAuthSub();
    });
};

export const useAuthDispatch = () => {
    const { getInstance } = useStorageDispatch();
    const resetRouter = useRouterReset();
    const setToken = useCallback(async (value: string) => {
        if (!AuthStore.getState().inited) return;
        AuthStore.setState((state) => {
            state.inited = false;
        });
        const storage = getInstance('auth');
        if (!storage) return;
        await storage.setItem('token', value);
        AuthStore.setState((state) => {
            state.token = value;
            state.inited = true;
        });
    }, []);
    const clearToken = useCallback(async () => {
        if (!AuthStore.getState().inited) return;
        AuthStore.setState((state) => {
            state.inited = false;
        });
        const storage = getInstance('auth');
        if (!storage) return;
        await storage.setItem('token', null);
        AuthStore.setState((state) => {
            state.token = null;
            state.user = null;
            state.inited = true;
        });
        resetRouter();
    }, []);
    return { setToken, clearToken };
};
