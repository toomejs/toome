import type { RouterConfig } from '@/components/Router';

import { constantsRoutes } from './routes/constants';

import { dynamicRoutes } from './routes/dynamic';

export const router: RouterConfig = {
    basePath: import.meta.env.BASE_URL,
    window: undefined,
    hash: false,
    routes: {
        constants: constantsRoutes(),
        dynamic: dynamicRoutes(),
    },
};
