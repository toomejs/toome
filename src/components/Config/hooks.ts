/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-29 11:55:51 +0800
 * @Updated_at     : 2022-01-11 14:33:23 +0800
 * @Path           : /src/components/Config/hooks.ts
 * @Description    : 配置组件钩子
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { useCallback } from 'react';

import { ConfigStore } from './store';
import { ColorConfig, ThemeTimeRange } from './types';
import { ThemeDepend, ThemeMode } from './constants';
/**
 * 判断当前面板是否使用antd组件开发
 */
export const useAntdCheck = () => ConfigStore(useCallback((state) => state.config.isAntd, []));
/**
 * 获取色系状态
 */
export const useColors = () => ConfigStore(useCallback((state) => state.config.colors, []));
/**
 * 获取某个颜色
 * @param name 颜色名称
 */
export const useColor = (name: keyof ColorConfig) =>
    ConfigStore(useCallback((state) => state.config.colors[name], [name]));
/**
 * 颜色操作
 */
export const useColorDispatch = () => ({
    changeColors: useCallback(
        /**
         * 切换颜色
         * @param colors 色系配置
         */
        (colors: ColorConfig) => {
            ConfigStore.setState((state) => {
                state.config.colors = { ...state.config.colors, ...colors };
            });
        },
        [],
    ),
    changeColor: useCallback(
        /**
         * 切换一个颜色
         * @param name 颜色名称
         * @param value 颜色值
         */
        (name: keyof ColorConfig, value: string) => {
            ConfigStore.setState((state) => {
                state.config.colors[name] = value;
            });
        },
        [],
    ),
});
/**
 * 获取主题状态
 */
export const useTheme = () => ConfigStore(useCallback((state) => state.config.theme.mode, []));
/**
 * 操作主题
 */
export const useThemeDispatch = () => ({
    changeTheme: useCallback(
        /**
         * 切换主题模式
         * @param theme 主题模式
         */
        (theme: `${ThemeMode}`) => {
            ConfigStore.setState((state) => {
                if (state.config.theme.depend === 'manual') state.config.theme.mode = theme;
            });
        },
        [],
    ),
    toggleTheme: useCallback(
        /**
         * 倒置主题
         */
        () => {
            ConfigStore.setState((state) => {
                if (state.config.theme.depend === 'manual') {
                    state.config.theme.mode =
                        state.config.theme.mode === 'light' ? 'dark' : 'light';
                }
            });
        },
        [],
    ),
    changeThemeDepend: useCallback(
        /**
         * 更改主题依赖
         * @param depend 依赖值
         */
        (depend: `${ThemeDepend}`) => {
            ConfigStore.setState((state) => {
                state.config.theme.depend = depend;
            });
        },
        [],
    ),
    changeThemeTiemeRange: useCallback(
        /**
         * 更改暗黑主题依赖时间
         * @param range 时间范围
         */
        (range: ThemeTimeRange) => {
            ConfigStore.setState((state) => {
                state.config.theme.range = { ...state.config.theme.range, ...range };
            });
        },
        [],
    ),
});
