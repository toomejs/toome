import { useAsyncEffect } from 'ahooks';

import { useCallback } from 'react';

import { createImmer } from '@/utils/store';

import { useStorage, useStorageStore } from '../Storage';

import type { ThemeConfig, ThemeMode, ThemeState } from './types';

const ThemeSetup = createImmer<{ setuped: boolean }>(() => ({ setuped: false }));
const ThemeStore = createImmer<ThemeState>(() => ({ mode: 'light' }));
export const useSetupTheme = (config?: ThemeConfig) => {
    const storageSetuped = useStorageStore.useSetuped();
    const theme = ThemeStore((state) => state.mode);
    const { addTable, getInstance } = useStorage();
    const themeSetuped = ThemeSetup((state) => state.setuped);
    useAsyncEffect(async () => {
        if (!themeSetuped && storageSetuped) {
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
            }
            ThemeSetup.setState(() => ({ setuped: true }), true);
        }
    }, [storageSetuped]);
    useAsyncEffect(async () => {
        const reverse = theme === 'dark' ? 'light' : 'dark';
        const html = document.documentElement;
        html.removeAttribute('data-theme');
        html.classList.remove(reverse);
        html.classList.remove(theme);
        html.setAttribute('data-theme', theme);
        html.classList.add(theme);
        const storage = getInstance('config');
        if (storage) {
            await storage.setItem<ThemeMode>('theme', theme);
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
