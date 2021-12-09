import { SmileOutlined } from '@ant-design/icons';

import type { AntdRouteOption } from '@/components/Router';

export const routes: AntdRouteOption[] = [
    {
        path: '/',
        page: 'layouts/master',
        auth: true,
        meta: { hideInMenu: true },
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
                        name: 'index',
                        index: true,
                        to: '/content/articles',
                        meta: { hideInMenu: true },
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
    {
        path: '/auth',
        meta: { hideInMenu: true },
        children: [
            {
                name: 'redirect',
                index: true,
                to: '/auth/login',
                meta: { hideInMenu: true },
            },
            {
                name: 'login',
                path: 'login',
                page: 'pages/auth/login',
                meta: { text: '登录页面', icon: <SmileOutlined /> },
            },
            {
                name: 'singup',
                path: 'signup',
                page: 'pages/auth/signup',
                meta: { text: '注册页面', icon: <SmileOutlined /> },
            },
        ],
    },
    {
        name: '404',
        path: '*',
        page: 'pages/errors/404',
        meta: { hideInMenu: true },
    },
];
