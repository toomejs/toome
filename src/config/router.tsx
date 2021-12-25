import type { AntdRouteMenuMeta, RouteOption, RouterConfig } from '@/components/Router';

import { auth, content, dashboard, errors } from './routes';

const constants: RouteOption<AntdRouteMenuMeta>[] = [...auth, ...errors];
const dynamic: RouteOption<AntdRouteMenuMeta>[] = [
    {
        path: '/',
        page: 'layouts/master',
        access: true,
        children: [...dashboard, ...content],
    },
];
export const router: RouterConfig<AntdRouteMenuMeta> = {
    basePath: import.meta.env.BASE_URL,
    window: undefined,
    hash: false,
    routes: {
        constants,
        dynamic,
    },
};
