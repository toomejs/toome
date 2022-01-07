import create from 'zustand';

import { createSubsciberImmer } from '@/utils';

import type { FetcherState } from './types';

export const FetcherSetup = create<{ setuped?: true }>(() => ({}));
export const FetcherStore = createSubsciberImmer<FetcherState>(() => ({ axios: {}, swr: {} }));
