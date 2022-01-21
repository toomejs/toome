import { useUnmount } from 'react-use';

import { useCallback } from 'react';

import { isNil } from 'ramda';

import { deepMerge, useStoreSetuped } from '@/utils';

import { useNavigator } from '../Router';

import { KeepAliveSetup, KeepAliveStore } from './store';

import { KeepAliveConfig } from './types';
import { AliveActionType } from './constants';

export const useSetupKeepAlive = (config: KeepAliveConfig) => {
    useStoreSetuped({
        store: KeepAliveSetup,
        callback: () => {
            KeepAliveStore.setState((state) => deepMerge(state, config, 'replace'), true);
        },
    });
    const listenLives = KeepAliveStore.subscribe(
        (state) => state.lives,
        (lives) => {
            KeepAliveStore.setState((state) => {
                state.include = lives;
            });
        },
    );
    useUnmount(() => {
        listenLives();
    });
};
export const useActivedAlive = () => KeepAliveStore(useCallback((state) => state.active, []));
export const useKeepAlives = () => KeepAliveStore(useCallback((state) => state.lives, []));
export const useKeepAliveDispath = () => {
    const navigate = useNavigator();
    const removeAlive = useCallback(
        (id: string) => {
            KeepAliveStore.dispatch({
                type: AliveActionType.REMOVE,
                params: { id, navigate },
            });
        },
        [navigate],
    );
    const removeAlives = useCallback(
        (ids: string[]) => {
            KeepAliveStore.dispatch({
                type: AliveActionType.REMOVE_MULTI,
                params: { ids, navigate },
            });
        },
        [navigate],
    );

    const changeAlive = useCallback(
        (id: string) => {
            KeepAliveStore.dispatch({
                type: AliveActionType.CHANGE,
                params: { id, navigate },
            });
        },
        [navigate],
    );
    const clearAlives = useCallback(() => {
        KeepAliveStore.dispatch({
            type: AliveActionType.CLEAR,
            navigate,
        });
    }, [navigate]);
    const refreshAlive = useCallback(
        (id: string | null) => {
            KeepAliveStore.dispatch({
                type: AliveActionType.RESET,
                params: { id, navigate },
            });
            if (!isNil(id) && navigate) navigate({ id });
        },
        [navigate],
    );
    return { changeAlive, removeAlive, removeAlives, clearAlives, refreshAlive };
};
