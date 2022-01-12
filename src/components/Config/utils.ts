/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-29 11:56:17 +0800
 * @Updated_at     : 2022-01-11 19:47:14 +0800
 * @Path           : /src/components/Config/utils.ts
 * @Description    : 配置组件工具函数
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { ConfigProvider } from 'antd';
import { enable as enableDarkMode, disable as disableDarkMode } from 'darkreader';

import { MutableRefObject } from 'react';

import { timer } from '@/utils/timer';

import { ColorConfig } from './types';

import { ConfigStore } from './store';
import { ThemeMode } from './constants';
/**
 * 订阅颜色变化来触发Antd动态配置组件
 * @param colors 当前颜色状态
 */
export const subscribeColors = (colors: ColorConfig) => {
    const newColors = { ...ConfigStore.getState().config.colors, ...colors };
    if (ConfigStore.getState().config.isAntd) {
        ConfigProvider.config({
            theme: Object.fromEntries(
                Object.keys(newColors).map((k) => [`${k}Color`, newColors[k]]),
            ),
        });
    }
};

/**
 * 订阅主题变化
 * @param theme 当前主题模式
 * @param themeRef 前一个主题模式,用于`watcher`监听
 */
export const subscribeThemeMode = (
    theme: `${ThemeMode}`,
    themeRef: MutableRefObject<'light' | 'dark'>,
) => {
    const { config } = ConfigStore.getState();
    // 为tailwind添加暗黑主题类
    const reverse = theme === 'dark' ? 'light' : 'dark';
    const html = document.documentElement;
    html.classList.remove(reverse);
    html.classList.remove(theme);
    html.classList.add(theme);
    // 为antd使用enableDark设置暗黑主题
    if (config.isAntd) {
        if (theme === 'dark') {
            enableDarkMode(config.theme.darken!.theme!, config.theme.darken!.fixes as any);
        } else {
            disableDarkMode();
        }
    }
    themeRef.current = theme;
};
/**
 * 主题切换依赖监听
 * @param themeRef 当主题改变时切换主题
 */
export const createThemeWatcher = (themeRef: MutableRefObject<'light' | 'dark'>) => {
    const { watchers = {}, config } = ConfigStore.getState();
    // 清除原有监听
    if (watchers.theme) clearInterval(watchers.theme);
    const watcher = () => {
        const mode = getDependTheme();
        // 根据依赖切换到最新的主题模式
        ConfigStore.setState((state) => {
            if (themeRef.current !== mode) state.config.theme.mode = mode;
        });
    };
    // 在主题模式依赖于系统或时间时开始监听,10s重置一次主题模式
    if (config.theme.depend === 'os' || config.theme.depend === 'time') {
        watcher();
        ConfigStore((state) => {
            state.watchers.theme = setInterval(watcher, 100000);
        });
    }
};
/**
 * 根据依赖获取新的主题模式
 */
const getDependTheme = (): `${ThemeMode}` => {
    const { config } = ConfigStore.getState();
    const { mode, depend, range } = config.theme;
    let isDark = false;
    if (depend === 'os') {
        // 获取系统主题模式
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else if (depend === 'time') {
        // 根据时间获取主题模式
        const current = timer();
        isDark =
            current.isSameOrAfter(timer({ date: range.light })) &&
            current.isBefore(timer({ date: range.dark }));
    } else {
        isDark = mode === 'dark';
    }
    return isDark ? 'dark' : 'light';
};
