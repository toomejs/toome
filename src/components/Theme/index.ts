import { useEffect } from 'react';

import { createHookSelectors, createImmer } from '@/utils/store';

import { useStorageStore } from '../Storage';

import type { ThemeConfig, ThemeState } from './types';

const ThemeSetup = createImmer<{ setuped: boolean }>(() => ({ setuped: false }));
export const themeSetuped = ThemeSetup((state) => state.setuped);
const ThemeStore = createImmer<ThemeState>(() => ({ mode: 'light' }));
const useThemeState = createHookSelectors(ThemeStore);
export const useSetupTheme = (config?: ThemeConfig) => {
    const storageSetuped = useStorageStore.useSetuped();
    useEffect(() => {
        if (!themeSetuped && storageSetuped) {
            if (config) ThemeStore.setState((state) => ({ ...state, ...config }), true);
            ThemeSetup(() => ({ setuped: true }), true);
        }
    }, [storageSetuped]);
};
