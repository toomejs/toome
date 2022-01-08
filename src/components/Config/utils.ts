import { ConfigProvider } from 'antd';
import { enable as enableDarkMode, disable as disableDarkMode } from 'darkreader';

import { timer } from '@/utils/timer';

import type { ColorConfig } from './types';

import { ConfigStore } from './store';
import type { ThemeMode } from './constants';

export const subscribeColors = (colors: ColorConfig) => {
    const newColors = { ...ConfigStore.getState().config.colors, ...colors };
    ConfigProvider.config({
        theme: Object.fromEntries(Object.keys(newColors).map((k) => [`${k}Color`, newColors[k]])),
    });
};
export const subscribeThemeMode = (theme: `${ThemeMode}`) => {
    const { config } = ConfigStore.getState();
    const reverse = theme === 'dark' ? 'light' : 'dark';
    const html = document.documentElement;
    html.classList.remove(reverse);
    html.classList.remove(theme);
    html.classList.add(theme);
    if (theme === 'dark') {
        enableDarkMode(config.theme.darken!.theme!, config.theme.darken!.fixes as any);
    } else {
        disableDarkMode();
    }
};
export const createThemeWatcher = () => {
    const { watchers = {}, config } = ConfigStore.getState();
    if (watchers.theme) clearInterval(watchers.theme);
    const watcher = () => {
        const mode = getDependTheme();
        ConfigStore.setState((state) => {
            state.config.theme.mode = mode;
        });
    };
    if (config.theme.depend === 'os' || config.theme.depend === 'time') {
        ConfigStore((state) => {
            state.watchers.theme = setInterval(watcher, 100000);
        });
    }
};

const getDependTheme = (): `${ThemeMode}` => {
    const { config } = ConfigStore.getState();
    const { mode, depend, range } = config.theme;
    let isDark = false;
    if (depend === 'os') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else if (depend === 'time') {
        const current = timer();
        isDark =
            current.isSameOrAfter(timer({ date: range.light })) &&
            current.isBefore(timer({ date: range.dark }));
    } else {
        isDark = mode === 'dark';
    }
    return isDark ? 'dark' : 'light';
};
