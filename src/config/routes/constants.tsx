import type { RouteOption } from '@/components/Router';

export const constantsRoutes = () => [...auth, ...errors];
const auth: RouteOption[] = [
    {
        path: '/auth',
        children: [
            {
                name: 'auth.redirect',
                index: true,
                to: '/auth/login',
                meta: { hide: true },
            },
            {
                name: 'auth.login',
                path: 'login',
                page: 'auth/login',
                meta: { hide: true },
            },
            {
                name: 'auth.singup',
                path: 'signup',
                page: 'auth/signup',
                meta: { hide: true },
            },
        ],
    },
];

const errors: RouteOption[] = [
    {
        name: '404',
        path: '*',
        page: 'errors/404',
        meta: { hide: true },
    },
];
