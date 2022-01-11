/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2022-01-04 11:01:24 +0800
 * @Updated_at     : 2022-01-10 19:07:38 +0800
 * @Path           : /src/components/Config/setup.ts
 * @Description    : 配置组件初始化
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { useUnmount } from 'react-use';

import { MutableRefObject, useRef } from 'react';

import { deepMerge, debounceRun } from '@/utils';

import { StorageSetup, useStorageDispatch } from '../Storage';

import { ConfigProps, ConfigStoreType } from './types';
import { ConfigSetup, ConfigStore } from './store';
import { createThemeWatcher, subscribeColors, subscribeThemeMode } from './utils';
import { ThemeMode } from './constants';
/**
 * 初始化配置组件
 * @param config 自定义配置
 */
export const useSetupConfig = (config?: ConfigProps) => {
    const { addTable, getInstance } = useStorageDispatch();
    const themeRef = useRef<`${ThemeMode}`>('light');
    const unStorageSub = StorageSetup.subscribe(
        (state) => state.setuped,
        async (setuped) => {
            if (!setuped) return;
            // 在storage初始化后取消此订阅
            unStorageSub();
            // 合并配置
            ConfigStore.setState((state) => {
                state.config = deepMerge(state.config, config ?? {});
            }, true);
            addTable({ name: 'app' });
            const storage = getInstance('app');
            if (!storage) return;
            // 初始化
            await initConfigState(storage, themeRef);
            ConfigSetup.setState((state) => {
                state.setuped = true;
            });
        },
    );
    // 订阅配置变
    useConfigSubscriber(themeRef);
    // 组件卸载后取消所有订阅
    useUnmount(() => {
        unStorageSub();
        ConfigStore.destroy();
    });
};

/**
 * 组件初始化函数
 * @param storage 存储对象
 * @param themeRef 前一个主题模式,用于`watcher`监听
 */
export const initConfigState = async (
    storage: LocalForage,
    themeRef: MutableRefObject<'light' | 'dark'>,
) => {
    const StorageConfig = (await storage.getItem<ConfigStoreType['config']>('config')) || {};
    // 合并本地存储配置
    ConfigStore.setState((state) => {
        state.config = deepMerge(state.config, StorageConfig, 'replace');
    });
    const { config } = ConfigStore.getState();
    await storage.setItem('config', config);
    // 根据主题模式依赖创建切换监听器
    createThemeWatcher(themeRef);
    // 监听主题模式变化
    subscribeThemeMode(config.theme.mode, themeRef);
    // 监听颜色变化
    subscribeColors(config.colors);
};
/**
 * 状态监听钩子
 * @param themeRef 前一个主题模式,用于`watcher`监听
 */
export const useConfigSubscriber = async (themeRef: MutableRefObject<'light' | 'dark'>) => {
    const { getInstance } = useStorageDispatch();
    const debounceRef = useRef();
    const subsciber = getItemSubscriber(() => getInstance('app'));
    // 监听主题依赖,如果改变则重新创建主题模式监听器
    ConfigStore.subscribe(
        (state) => state.config.theme.depend,
        () => subsciber(() => createThemeWatcher(themeRef)),
    );
    // 监听主题暗黑时间范围,如果改变则重新创建主题模式监听器
    ConfigStore.subscribe(
        (state) => state.config.theme.range,
        () => subsciber(() => createThemeWatcher(themeRef)),
    );
    // 监听主题模式,切换时使用防抖模式
    ConfigStore.subscribe(
        (state) => state.config.theme.mode,
        (mode) => {
            debounceRun(debounceRef, () => subsciber(() => subscribeThemeMode(mode, themeRef)));
        },
    );
    // 监听颜色
    ConfigStore.subscribe(
        (state) => state.config.colors,
        (colors) => subsciber(() => subscribeColors(colors)),
    );
    // 监听配置,如果变化则重新存储
    ConfigStore.subscribe(
        (state) => state.config,
        async (config) => subsciber((storage) => storage.setItem('config', config)),
    );
};
/**
 * 监听执行函数,用于在某个状态变化时触发回调
 * @param storageGetter 获取storage存储池的函数
 */
const getItemSubscriber = (storageGetter: () => LocalForage | undefined) => {
    const subscriber = <T extends any | Promise<any>>(
        callback: (storage: LocalForage) => T,
    ): T | undefined => {
        const storage = storageGetter();
        const { setuped } = ConfigSetup.getState();
        if (setuped && storage) {
            return callback(storage);
        }
        return undefined;
    };
    return subscriber;
};
