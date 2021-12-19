import create from 'zustand';

import { createImmer, deepMerge, useStoreSetuped } from '@/utils';

import type { ChartConfig, ChartState } from './types';
import { getDefaultChartConfig } from './_default.config';

export const ChartSetuped = create<{ setuped?: true }>(() => ({}));

export const ChartStore = createImmer<ChartState>(() => getDefaultChartConfig());
export const useSetupCharts = (config?: ChartConfig) => {
    useStoreSetuped({
        store: ChartSetuped,
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
