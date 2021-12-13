import { SmileOutlined } from '@ant-design/icons';

import type { AntdRouteMenuMeta, RouterConfig } from '@/components/Router';

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
                        page: 'auth/login',
                        meta: { hide: true },
                    },
                    {
                        name: 'auth.singup',
                        path: 'signup',
                        page: 'auth/signup',
                        // meta: { hide: true },
                    },
                ],
            },
            {
                name: '404',
                path: '*',
                page: 'errors/404',
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
                        page: 'dashboard/index',
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
                                page: 'content/articles/index',
                                meta: { text: '文章管理', icon: <SmileOutlined /> },
                            },
                            {
                                name: 'categories',
                                path: 'categories',
                                page: 'content/categories/index',
                                meta: { text: '分类管理', icon: <SmileOutlined /> },
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
