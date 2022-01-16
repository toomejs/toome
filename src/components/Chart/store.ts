import create from 'zustand';

import { createStore } from '@/utils';

import type { ChartState } from './types';
import { getDefaultChartConfig } from './_default.config';

export const ChartSetup = create<{ setuped?: true }>(() => ({}));

export const ChartStore = createStore<ChartState>(() => getDefaultChartConfig());
