import create from 'zustand';

import { createHookSelectors, createSubsciberImmer } from '@/utils';

import { getDefaultMenuStore } from './_default.config';
import type { MenuStoreType } from './types';

export const MenuSetuped = create<{ setuped?: true }>(() => ({}));
export const MenuStore = createSubsciberImmer<MenuStoreType>(() => getDefaultMenuStore());
export const useMenu = createHookSelectors(MenuStore);
