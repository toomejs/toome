import { redux } from 'zustand/middleware';
import create from 'zustand';

import { createSubsciber, SetupedState } from '@/utils';

import { fixStorage, storageReducer } from './utils';

/**
 * Storage初始化状态的store
 */
export const StorageSetup = createSubsciber<SetupedState>(() => ({}));
/**
 * Storage状态管理store
 */
export const StorageStore = create(redux(storageReducer, { config: fixStorage({}) }));
