import create from 'zustand';

import { createImmer } from '@/utils';

import { getDefaultIconConfig } from './_default.config';
import type { IconState } from './types';

export const IconSetup = create<{ setuped?: true }>(() => ({}));

export const IconStore = createImmer<IconState>(() => getDefaultIconConfig());
