import { useUpdateEffect } from 'ahooks';
import { useCallback } from 'react';

import { useSetupedEffect } from '@/hooks';

import { useStorage, useStorageStore } from '../Storage';

import { ThemeSetup, ThemeStore } from './store';

import type { ThemeConfig, ThemeMode } from './types';

export const useSetupTheme = (config?: ThemeConfig) => {
    const storageSetuped = useStorageStore.useSetuped();
    const theme = ThemeStore((state) => state.mode);
    const { addTable, getInstance } = useStorage();
    useSetupedEffect(
        ThemeSetup,
        async () => {
            if (config) ThemeStore.setState(() => config, true);
            addTable({ name: 'config' });
            const storage = getInstance('config');
            if (storage) {
                const themeMode = await storage.getItem<ThemeMode | undefined>('theme');
                ThemeStore.setState((state) => {
                    state.mode = themeMode || state.mode;
                });
            }
        },
        [storageSetuped],
    );
    useUpdateEffect(() => {
        const storage = getInstance('config');
        console.log(theme);
        if (ThemeSetup.getState().created && storage) {
            const reverse = theme === 'dark' ? 'light' : 'dark';
            const html = document.documentElement;
            html.removeAttribute('data-theme');
            html.classList.remove(reverse);
            html.classList.remove(theme);
            html.setAttribute('data-theme', theme);
            html.classList.add(theme);
            storage.setItem<ThemeMode>('theme', theme);
        }
    }, [theme]);
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
