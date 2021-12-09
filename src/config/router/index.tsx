import { RequirdAuth } from '@/components/Auth';
import type { RouterConfig } from '@/components/Router';

import { routes } from './routes';

export const router: RouterConfig = {
    basename: import.meta.env.BASE_URL,
    window: undefined,
    hash: false,
    render: (basename, route, element) => (
        <RequirdAuth basename={basename} route={route} element={element} path="/auth/login" />
    ),
    routes,
};
