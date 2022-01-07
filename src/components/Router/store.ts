import { createSubsciberImmer } from '@/utils';

import { getDefaultStore } from './_default.config';
import type { RouterStatusType, RouterStoreType } from './types';

/**
 * 路由初始化信号
 */
export const RouterStatus = createSubsciberImmer<RouterStatusType>(() => ({
    next: false,
    ready: false,
    success: false,
}));
export const RouterStore = createSubsciberImmer<RouterStoreType>(() => getDefaultStore());
