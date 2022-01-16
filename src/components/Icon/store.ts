import create from 'zustand';

import { createStore } from '@/utils';

import { getDefaultIconConfig } from './_default.config';
import type { IconState } from './types';

export const IconSetup = create<{ setuped?: true }>(() => ({}));

export const IconStore = createStore<IconState>(() => getDefaultIconConfig());
