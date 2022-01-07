import { useCallback } from 'react';

import { ConfigStore } from './store';
import type { ColorConfig, LayoutTheme, ThemeTimeRange } from './types';
import type { ThemeDepend, ThemeMode, LayoutMode, LayoutComponent } from './constants';

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
export const useLayoutConfigDispatch = () => ({
    changeFixed: useCallback((type: `${LayoutComponent}`, fixed: boolean) => {
        ConfigStore.setState((state) => {
            state.config.layout.fixed[type] = fixed;
        });
    }, []),
    changeLayoutTheme: useCallback((theme: LayoutTheme) => {
        ConfigStore.setState((state) => {
            state.config.layout.theme = { ...state.config.layout.theme, ...theme };
        });
    }, []),
    changeLayoutMode: useCallback((mode: `${LayoutMode}`) => {
        ConfigStore.setState((state) => {
            state.config.layout.mode = mode;
        });
    }, []),
    changeCollapse: useCallback((collapsed: boolean) => {
        ConfigStore.setState((state) => {
            state.config.layout.collapsed = collapsed;
        });
    }, []),
    toggleCollapse: useCallback(() => {
        ConfigStore.setState((state) => {
            state.config.layout.collapsed = !state.config.layout.collapsed;
        });
    }, []),
});
