import { useUnmount } from 'react-use';

import { useCallback } from 'react';

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
    const changeAlive = useCallback(
        (id: string) => {
            KeepAliveStore.dispatch({
                type: AliveActionType.CHANGE,
                params: { id, navigate },
            });
        },
        [navigate],
    );
    return { changeAlive, removeAlive };
};
