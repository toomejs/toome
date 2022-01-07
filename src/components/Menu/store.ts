import { createSubsciberImmer } from '@/utils';

import { getDefaultMenuStore } from './_default.config';
import type { MenuStoreType, MenuStatusType } from './types';

export const MenuStatus = createSubsciberImmer<MenuStatusType>(() => ({ next: false }));
export const MenuStore = createSubsciberImmer<MenuStoreType>(() => getDefaultMenuStore());
