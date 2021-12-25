import type { AntdRouteMenuMeta, RouteOption } from '@/components/Router';

export const errors: RouteOption<AntdRouteMenuMeta>[] = [
    {
        name: '404',
        path: '*',
        page: 'errors/404',
        meta: { hide: true },
    },
];
