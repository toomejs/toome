import { useCallback, useRef } from 'react';

import { useSetupedEffect } from '@/hooks';

import { useStorage, useStorageStore } from '../Storage';

import { ThemeSetup, ThemeStore } from './store';

import type { ThemeConfig, ThemeMode } from './types';
import { changeHtmlThemeMode } from './utils';

export const useSetupTheme = (config?: ThemeConfig) => {
    const storageSetuped = useStorageStore.useSetuped();
    const { addTable, getInstance } = useStorage();
    const changing = useRef<boolean>(false);
    useSetupedEffect(
        {
            store: ThemeSetup,
            callback: async () => {
                if (config) ThemeStore.setState(() => config, true);
                addTable({ name: 'config' });
                const storage = getInstance('config');
                if (storage) {
                    const themeMode = await storage.getItem<ThemeMode | undefined>('theme');
                    if (themeMode) {
                        ThemeStore.setState((state) => {
                            state.mode = themeMode;
                        });
                    }
                    changeHtmlThemeMode(ThemeStore.getState().mode, storage);

                    ThemeStore.subscribe(
                        (state) => state.mode,
                        (next) => {
                            if (!changing.current) {
                                changing.current = true;
                                setTimeout(() => {
                                    changeHtmlThemeMode(next, storage);
                                    changing.current = false;
                                }, 100);
                            }
                        },
                    );
                }
            },
            clear: () => {
                ThemeSetup.destroy();
            },
        },
        [storageSetuped],
    );
};
export const useTheme = () => ThemeStore(useCallback((state) => state.mode, []));

export const useThemeDispatch = () => ({
    changeTheme: useCallback(
        (theme: ThemeMode) => () =>
            ThemeStore.setState((state) => {
                state.mode;
            }),
        [],
    ),
    toggleTheme: useCallback(
        () =>
            ThemeStore.setState((state) => {
                state.mode = state.mode === 'light' ? 'dark' : 'light';
            }),
        [],
    ),
});
