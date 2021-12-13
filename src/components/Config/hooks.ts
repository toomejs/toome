import { useCreation } from 'ahooks';
import { useMemo } from 'react';

import shallow from 'zustand/shallow';

import { createImmer } from '@/utils/store';

import { deepMerge } from '@/utils/tools';

import { useStorageStore } from '../Storage';

import { defaultConfig } from './_default.config';
import type { Config, ConfigState } from './types';

type ConfigStore = { config: ConfigState; inited: boolean };
const useStore = createImmer<ConfigStore>(() => ({ config: defaultConfig, inited: false }));
export const useConfigInit = (config?: Config) => {
    const inited = useStore((state) => state.inited);
    const setupStorage = useStorageStore.useSetuped();
    if (config && setupStorage && !inited) {
        useStore.setState((draft) => {
            draft.config = deepMerge(draft.config, config);
            draft.inited = true;
        });
    }
    return useMemo(() => inited, [inited]);
};

export const useConfigure = () => useStore;
export const useConfig = () => {
    const config = useStore((s) => s.config, shallow);
    return useCreation(() => config, [config]);
};
