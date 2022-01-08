import { useUnmount } from 'react-use';

import { useRef } from 'react';

import { deepMerge, debounceRun } from '@/utils';

import { StorageSetup, useStorageDispatch } from '../Storage';

import type { ConfigProps, ConfigStoreType } from './types';
import { ConfigSetup, ConfigStore } from './store';
import { createThemeWatcher, subscribeColors, subscribeThemeMode } from './utils';

export const useSetupConfig = (config?: ConfigProps) => {
    const { addTable, getInstance } = useStorageDispatch();

    const unStorageSub = StorageSetup.subscribe(
        (state) => state.setuped,
        async (setuped) => {
            if (!setuped) return;
            unStorageSub();
            if (config) {
                ConfigStore.setState((state) => {
                    state.config = deepMerge(state.config, config);
                }, true);
            }
            addTable({ name: 'app' });
            const storage = getInstance('app');
            if (!storage) return;
            await initConfigState(storage);
            ConfigSetup.setState((state) => {
                state.setuped = true;
            });
        },
    );
    useConfigSubscriber();
    useUnmount(() => {
        unStorageSub();
        ConfigStore.destroy();
    });
};

export const initConfigState = async (storage: LocalForage) => {
    const StorageConfig = (await storage.getItem<ConfigStoreType['config']>('config')) || {};
    ConfigStore.setState((state) => {
        state.config = deepMerge(state.config, StorageConfig, 'replace');
    });
    const { config } = ConfigStore.getState();
    await storage.setItem('config', config);
    createThemeWatcher();
    subscribeThemeMode(config.theme.mode);
    subscribeColors(config.colors);
    // subscribeLayoutMode(config.layout.mode);
};
export const useConfigSubscriber = async () => {
    const { getInstance } = useStorageDispatch();
    const themeRef = useRef();
    const subsciber = getItemSubscriber(() => getInstance('app'));
    ConfigStore.subscribe(
        (state) => state.config.theme.depend,
        () => subsciber(createThemeWatcher),
    );
    ConfigStore.subscribe(
        (state) => state.config.theme.range,
        () => subsciber(createThemeWatcher),
    );
    ConfigStore.subscribe(
        (state) => state.config.theme.mode,
        (mode) => {
            debounceRun(themeRef, () => {
                subsciber(() => subscribeThemeMode(mode));
            });
        },
    );
    ConfigStore.subscribe(
        (state) => state.config.colors,
        (colors) => subsciber(() => subscribeColors(colors)),
    );
    ConfigStore.subscribe(
        (state) => state.config,
        async (config) => subsciber((storage) => storage.setItem('config', config)),
    );
};

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
