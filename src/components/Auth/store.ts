import { createSubsciberImmer } from '@/utils';

import type { AuthStoreType } from './types';

/**
 * 账户状态储存池
 */
export const AuthStore = createSubsciberImmer<AuthStoreType>(() => ({
    token: null,
    user: null,
    inited: false,
}));
