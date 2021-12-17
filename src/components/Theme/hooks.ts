import { useCallback, useRef } from 'react';

import create from 'zustand';

import { useStoreSetuped, debounceRun, createSubsciberImmer } from '@/utils';

import { useStorage, useStorageStore } from '../Storage';

import type { ThemeConfig, ThemeMode, ThemeState } from './types';
import { changeHtmlThemeMode } from './utils';

const ThemeSetup = create(() => ({}));
const ThemeStore = createSubsciberImmer<ThemeState>(() => ({ mode: 'light' }));
/**
 * @description : 根据配置初始化主题
 * @param        {ThemeConfig} config
 * @return       {void}
 */
export const useSetupTheme = (config?: ThemeConfig) => {
    const storageSetuped = useStorageStore.useSetuped();
    const { addTable, getInstance } = useStorage();
    const changing = useRef();
    useStoreSetuped(
        {
            store: ThemeSetup,
            callback: async () => {
                if (config) ThemeStore.setState(() => config, true);
                // 添加本地存储表
                addTable({ name: 'config' });
                const storage = getInstance('config');
                if (storage) {
                    // 如果本地存储已经有配置则使用本地配置
                    const themeMode = await storage.getItem<ThemeMode | undefined>('theme');
                    if (themeMode) {
                        ThemeStore.setState((state) => {
                            state.mode = themeMode;
                        });
                    }

                    // 首次运行根据配置设置element
                    changeHtmlThemeMode(ThemeStore.getState().mode, storage);

                    // 监听主题变化设置element
                    ThemeStore.subscribe(
                        (state) => state.mode,
                        (next) => debounceRun(changing, () => changeHtmlThemeMode(next, storage)),
                    );
                }
            },
            clear: () => {
                // 组件卸载清除监听
                ThemeSetup.destroy();
            },
        },
        [storageSetuped],
    );
};

/**
 * @description : 获取当前主题
 * @param        {*} ThemeStore
 * @return       {ThemeMode}
 */
export const useTheme = () => ThemeStore(useCallback((state) => state.mode, []));
/**
 * @description : 主题操作
 * @param
 * @return       {*}
 */
export const useThemeDispatch = () => ({
    changeTheme: useCallback(
        (theme: ThemeMode) => () =>
            ThemeStore.setState((state) => {
                state.mode = theme;
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
