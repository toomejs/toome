import { useAsyncEffect, useSafeState } from 'ahooks';

import { useCallback } from 'react';

import create from 'zustand';

import { createHookSelectors, createImmer, useStoreSetuped } from '@/utils';
import type { SetupedState } from '@/utils';

import { useFetcher } from '../Request';

import { useRouterReset } from '../Router/hooks/store';
import { useStorage, useStorageStore } from '../Storage';

import type { AuthStore, User } from './types';

const AuthSetuped = create<SetupedState>(() => ({}));
const useAuthStore = createImmer<AuthStore>(() => ({ token: null, user: null, inited: false }));
export const useAuth = createHookSelectors(useAuthStore);
export const useAuthInited = () => useAuth.useInited();
export const useToken = () => useAuth.useToken();
export const useUser = <
    T extends RecordAnyOrNever = RecordNever,
    R extends RecordAnyOrNever = RecordNever,
    P extends RecordAnyOrNever = RecordNever,
>() => useAuth.useUser() as User<T, R, P>;

export const getToken = () => useAuthStore.getState().token;
export const getUser = () => useAuthStore.getState().user;
export const useSetupAuth = (accout_api?: string) => {
    const fetcher = useFetcher();
    const storageSetuped = useStorageStore.useSetuped();
    const { addTable, getInstance } = useStorage();
    const resetRouter = useRouterReset();
    const token = useToken();
    const [api, setApi] = useSafeState<string | undefined>();
    useStoreSetuped(
        {
            store: AuthSetuped,
            callback: async () => {
                addTable({ name: 'auth' });
                const storage = getInstance('auth');
                if (storage) {
                    if (accout_api !== undefined) setApi(accout_api);
                    const storgeToken = await storage.getItem<string | null>('token');
                    useAuthStore.setState((state) => {
                        state.token = storgeToken ?? null;
                        state.inited = true;
                    });
                    if (!storgeToken) {
                        await storage.setItem('token', null);
                        resetRouter();
                    } else {
                        await storage.setItem('token', storgeToken);
                    }
                }
            },
            clear: () => {
                // 组件卸载清除监听
                AuthSetuped.destroy();
            },
        },
        [storageSetuped],
    );
    useAsyncEffect(async () => {
        if (token && api) {
            try {
                const { data } = await fetcher().get(api);
                if (data) {
                    useAuthStore.setState((state) => {
                        state.user = data;
                    });
                }
            } catch (error) {
                useAuthStore.setState((state) => {
                    state.user = null;
                });
            }
            resetRouter();
        }
    }, [api, token]);
};

export const useAuthDispatch = () => {
    const { getInstance } = useStorage();
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
    return { setToken, clearToken };
};
