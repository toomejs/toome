import create from 'zustand';
import { redux } from 'zustand/middleware';

import { createSubsciber } from '@/utils';

import { fixStorage, storageReducer } from './utils';

export const StorageSetup = createSubsciber<{ setuped?: true }>(() => ({}));
export const StorageStore = create(redux(storageReducer, { config: fixStorage({}) }));
