import create from 'zustand';

import { createImmer } from '@/utils';

import type { ChartState } from './types';
import { getDefaultChartConfig } from './_default.config';

export const ChartSetup = create<{ setuped?: true }>(() => ({}));

export const ChartStore = createImmer<ChartState>(() => getDefaultChartConfig());
