import { createSubsciberImmer } from '@/utils';

import type { ConfigStoreType } from './types';
import { defaultConfig } from './_default.config';

export const ConfigSetup = createSubsciberImmer<{ setuped?: true }>(() => ({}));
export const ConfigStore = createSubsciberImmer<ConfigStoreType>(() => ({
    config: defaultConfig,
    watchers: {},
}));
