import { SmileOutlined } from '@ant-design/icons';

import type { AntdRouteMenuMeta, RouterConfig } from '@/components/Routing';

export const routing: RouterConfig<AntdRouteMenuMeta> = {
    basePath: import.meta.env.BASE_URL,
    window: undefined,
    hash: false,
    routes: {
        constants: [
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
                        page: 'pages/auth/login',
                        meta: { hide: true },
                    },
                    {
                        name: 'auth.singup',
                        path: 'signup',
                        page: 'pages/auth/signup',
                        meta: { hide: true },
                    },
                ],
            },
            {
                name: '404',
                path: '*',
                page: 'pages/errors/404',
                meta: { hide: true },
            },
        ],
        dynamic: [
            {
                path: '/',
                page: 'layouts/master',
                access: true,
                children: [
                    {
                        name: 'dashboard',
                        index: true,
                        page: 'pages/dashboard/index',
                        meta: { text: '仪表盘', icon: <SmileOutlined /> },
                    },
                    {
                        name: 'content',
                        path: 'content',
                        meta: { text: '内容', icon: <SmileOutlined /> },
                        children: [
                            {
                                name: 'content.index',
                                index: true,
                                to: '/content/articles',
                                meta: { hide: true },
                            },
                            {
                                name: 'articles',
                                path: 'articles',
                                page: 'pages/content/articles/index',
                                meta: { text: '文章管理', icon: <SmileOutlined /> },
                            },
                            {
                                name: 'categories',
                                path: 'categories',
                                page: 'pages/content/categories/index',
                                meta: { text: '分类管理', icon: <SmileOutlined /> },
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
