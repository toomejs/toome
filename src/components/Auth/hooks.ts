import { useAsyncEffect, useDeepCompareEffect, useSafeState } from 'ahooks';

import { dequal } from 'dequal';
import { useCallback, useEffect, useRef } from 'react';

import create from 'zustand';

import { createHookSelectors, createImmer } from '@/utils/store';

import { useFetcher } from '../Request';

import { useRouterReset } from '../Router';
import { useStorage, useStorageStore } from '../Storage';

import type { User, TokenStore, UserStore } from './types';

const useTokenStore = create<TokenStore>(() => ({ setuped: false, value: null }));
export const useToken = createHookSelectors(useTokenStore);
export const useAuthStore = createImmer<UserStore>(() => ({
    user: null,
    requested: false,
    changed: false,
}));

export const useAuth = createHookSelectors(useAuthStore);
export const useUser = <
    T extends RecordAnyOrNever = RecordNever,
    R extends RecordAnyOrNever = RecordNever,
    P extends RecordAnyOrNever = RecordNever,
>() => useAuth.useUser() as User<T, R, P>;
export const useSetupToken = () => {
    const storageSetuped = useStorageStore.useSetuped();
    const { addTable, getInstance } = useStorage();
    const inited = useRef<boolean>(false);
    const resetRouter = useRouterReset();
    useAsyncEffect(async () => {
        if (!inited.current && storageSetuped) {
            addTable({ name: 'auth' });
            const storage = getInstance('auth');
            if (storage) {
                const storgeToken = await storage.getItem<string | null>('token');
                useTokenStore.setState((state) => {
                    state.value = storgeToken ?? null;
                    state.setuped = true;
                });
                if (!storgeToken) {
                    await storage.setItem('token', null);
                    resetRouter();
                } else {
                    await storage.setItem('token', storgeToken);
                }
            }
            inited.current = true;
        }
    }, [storageSetuped]);
};

export const useTokenDispatch = () => {
    const { getInstance } = useStorage();
    const setToken = useCallback(async (value: string) => {
        const storage = getInstance('auth');
        if (storage) await storage.setItem('token', value);
        useTokenStore.setState((draft) => {
            draft.value = value;
        });
    }, []);
    const clearToken = useCallback(async () => {
        const storage = getInstance('auth');
        if (storage) await storage.setItem('token', null);
        useTokenStore.setState((draft) => {
            draft.value = null;
        });
    }, []);
    return { setToken, clearToken };
};

export const useSetupAuth = (accout_api?: string) => {
    useSetupToken();
    const token = useToken.useValue();
    const fetcher = useFetcher();
    const [api, setApi] = useSafeState<string | undefined>();
    const user = useAuthStore((state) => state.user);
    const userRef = useRef<User | null>(user);
    const resetRouter = useRouterReset();
    useDeepCompareEffect(() => {
        useAuthStore.setState((state) => {
            state.changed = !dequal(userRef.current, user);
        });
    }, [user]);
    useEffect(() => {
        if (accout_api !== undefined) setApi(accout_api);
    }, [accout_api]);

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
