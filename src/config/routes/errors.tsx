import type { RouteOption } from '@/components/Router';

export const errors: RouteOption[] = [
    {
        name: '404',
        path: '*',
        page: 'errors/404',
        meta: { hide: true },
    },
];
