import { deepMerge, useStoreSetuped } from '@/utils';

import { ChartSetup, ChartStore } from './store';

import type { ChartConfig } from './types';

export const useSetupChart = (config?: ChartConfig) => {
    useStoreSetuped({
        store: ChartSetup,
        callback: () => {
            ChartStore.setState((state) =>
                deepMerge(state, {
                    ...config,
                    exts: config?.exts?.filter((e) => !state.exts.includes(e)) ?? [],
                }),
            );
        },
    });
};
