import create from 'zustand';

import { createSubsciberImmer } from '@/utils';

import type { FetcherConfig } from './types';

export const FetcherSetuped = create<{ setuped?: true }>(() => ({}));
export const FetcherStore = createSubsciberImmer<FetcherConfig>(() => ({}));
