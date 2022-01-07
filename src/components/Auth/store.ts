import { createSubsciberImmer } from '@/utils';

import type { AuthStoreType } from './types';

export const AuthStore = createSubsciberImmer<AuthStoreType>(() => ({
    token: null,
    user: null,
    inited: false,
}));
