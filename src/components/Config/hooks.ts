import { useCallback } from 'react';

import { isFunction } from 'lodash-es';

import produce from 'immer';

import { deepMerge } from '@/utils';

import { ConfigStore } from './store';
import type { ColorConfig, LayoutConfig, ThemeTimeRange } from './types';
import type { ThemeDepend, ThemeMode } from './constants';

export const useColors = () => ConfigStore(useCallback((state) => state.config.colors, []));
export const useColor = (name: keyof ColorConfig) =>
    ConfigStore(useCallback((state) => state.config.colors[name], [name]));
export const useColorDispatch = () => ({
    changeColors: useCallback((colors: ColorConfig) => {
        ConfigStore.setState((state) => {
            state.config.colors = { ...state.config.colors, ...colors };
        });
    }, []),
    changeColor: useCallback((name: keyof ColorConfig, value: string) => {
        ConfigStore.setState((state) => {
            state.config.colors[name] = value;
        });
    }, []),
});
export const useTheme = () => ConfigStore(useCallback((state) => state.config.theme.mode, []));
export const useThemeDispatch = () => ({
    changeTheme: useCallback((theme: `${ThemeMode}`) => {
        ConfigStore.setState((state) => {
            if (state.config.theme.depend === 'manual') state.config.theme.mode = theme;
        });
    }, []),
    toggleTheme: useCallback(() => {
        ConfigStore.setState((state) => {
            if (state.config.theme.depend === 'manual') {
                state.config.theme.mode = state.config.theme.mode === 'light' ? 'dark' : 'light';
            }
        });
    }, []),
    changeThemeDepend: useCallback((depend: `${ThemeDepend}`) => {
        ConfigStore.setState((state) => {
            state.config.theme.depend = depend;
        });
    }, []),
    changeThemeTiemeRange: useCallback((range: ThemeTimeRange) => {
        ConfigStore.setState((state) => {
            state.config.theme.range = { ...state.config.theme.range, ...range };
        });
    }, []),
});
export const useLayoutConfig = () => ConfigStore(useCallback((state) => state.config.layout, []));
export const useChangeLayoutConfig = () =>
    useCallback(
        (config: LayoutConfig | ((old: ReRequired<LayoutConfig>) => ReRequired<LayoutConfig>)) => {
            ConfigStore.setState((state) => {
                if (isFunction(config)) {
                    state.config.layout = produce(state.config.layout, config);
                } else {
                    state.config.layout = deepMerge(state.config.layout, config, 'replace');
                }
            });
        },
        [],
    );
