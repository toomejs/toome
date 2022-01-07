import { SmileOutlined } from '@ant-design/icons';

import type { AntdRouteMenuMeta, RouteOption } from '@/components/Router';

export const content: RouteOption<AntdRouteMenuMeta>[] = [
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
                meta: { text: '文章管理', icon: <SmileOutlined /> },
                children: [
                    {
                        index: true,
                        name: 'articles.list',
                        page: 'content/articles/list',
                        meta: { text: '文章列表', icon: <SmileOutlined /> },
                    },
                    {
                        name: 'articles.create',
                        path: 'create',
                        page: 'content/articles/create',
                        meta: { text: '新增文章', icon: <SmileOutlined /> },
                    },
                ],
            },
            {
                name: 'categories',
                path: 'categories',
                page: 'content/categories/index',
                meta: { text: '分类管理', icon: <SmileOutlined /> },
            },
        ],
    },
];
