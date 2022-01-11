import { useUnmount } from 'ahooks';

import { useCallback, useContext } from 'react';

import { isFunction } from 'lodash-es';

import produce from 'immer';

import { deepMerge } from '@/utils';

import { StorageSetup, useStorageDispatch } from '../Storage';

import {
    LayoutConfig,
    LayoutFixed,
    LayoutStorageStoreType,
    LayoutTheme,
    LayoutVarsConfig,
} from './types';
import { LayoutContext, LayoutDispatchContext, LayoutSetup, LayoutStore } from './store';
import { LayoutActionType, LayoutMode } from './constants';

export const useSetupLayout = (config?: LayoutConfig) => {
    const { addTable, getInstance } = useStorageDispatch();
    const localSetuped = StorageSetup((state) => state.setuped);
    const unStorageSub = StorageSetup.subscribe(
        (state) => state.setuped,
        async (setuped) => {
            if (!localSetuped || LayoutSetup.getState().setuped) return;
            // 在storage初始化后取消此订阅
            // 合并配置
            LayoutStore.setState((state) => deepMerge(state, config ?? {}), true);
            addTable({ name: 'app' });
            const storage = getInstance('app');
            if (!storage) return;
            const StorageConfig = (await storage.getItem<LayoutStorageStoreType>('layout')) || {};
            LayoutStore.setState((state) => deepMerge(state, StorageConfig, 'replace'), true);
            await storage.setItem('layout', LayoutStore.getState());
            LayoutSetup.setState((state) => {
                state.setuped = true;
            });
            // 监听配置,如果变化则重新存储
            LayoutStore.subscribe(
                (state) => state,
                async (state) => {
                    if (LayoutSetup.getState().setuped) storage.setItem('layout', state);
                },
            );
        },
        { fireImmediately: true },
    );
    useUnmount(() => {
        unStorageSub();
        LayoutStore.destroy();
    });
};

export const useLayoutLocalData = () => LayoutStore(useCallback((state) => state, []));
export const useChangeLayoutLocalData = () =>
    useCallback(
        (config: LayoutConfig | ((old: ReRequired<LayoutConfig>) => ReRequired<LayoutConfig>)) => {
            LayoutStore.setState((state) => {
                if (isFunction(config)) {
                    return produce(state, config);
                }
                return deepMerge(state, config, 'replace');
            }, true);
        },
        [],
    );

export const useLayout = () => {
    const state = useContext(LayoutContext);
    if (!state) throw new Error("please wrapper the layout width 'LayoutProvider'!");
    return state;
};
export const useLayoutDispatch = () => {
    const dispatch = useContext(LayoutDispatchContext);
    if (!dispatch) throw new Error("please wrapper the layout width 'LayoutProvider'!");
    const changeVars = useCallback(
        (vars: LayoutVarsConfig) => dispatch({ type: LayoutActionType.CHANGE_VARS, vars }),
        [],
    );
    const changeMode = useCallback(
        (mode: `${LayoutMode}`) => dispatch({ type: LayoutActionType.CHANGE_MODE, value: mode }),
        [],
    );
    const changeFixed = useCallback(
        (key: keyof LayoutFixed, value: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_FIXED, key, value }),
        [],
    );
    const changeTheme = useCallback(
        (theme: Partial<LayoutTheme>) =>
            dispatch({ type: LayoutActionType.CHANGE_THEME, value: theme }),
        [],
    );
    const changeCollapse = useCallback(
        (collapsed: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_COLLAPSE, value: collapsed }),
        [],
    );
    const toggleCollapse = useCallback(
        () => dispatch({ type: LayoutActionType.TOGGLE_COLLAPSE }),
        [],
    );
    const changeMobileSide = useCallback(
        (collapsed: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_MOBILE_SIDE, value: collapsed }),
        [],
    );
    const toggleMobileSide = useCallback(
        () => dispatch({ type: LayoutActionType.TOGGLE_MOBILE_SIDE }),
        [],
    );
    return {
        changeVars,
        changeMode,
        changeFixed,
        changeTheme,
        changeCollapse,
        toggleCollapse,
        changeMobileSide,
        toggleMobileSide,
    };
};
