import { SmileOutlined } from '@ant-design/icons';

import type { RouteOption, RouterConfig } from '@/components/Router';
import { Loading, Spinner } from '@/components/Spinner';

import { auth, content, dashboard, errors } from './routes';

const RouteLoading = () => {
    return (
        <Loading
            className="bg-white/80 dark:bg-black/70 -ml-2 -mt-2 !w-[calc(100%_+_theme(space.4))] !h-[calc(100%_+_theme(space.4))] transition-opacity duration-300"
            component={<Spinner name="Coffee" darkColor="rgb(252, 193, 105)" />}
        />
    );
};
const addLoading = (routes: RouteOption[]): RouteOption[] => {
    return routes.map((item) => {
        const data = {
            ...item,
            loading: RouteLoading,
        };
        if (data.children) data.children = addLoading([...data.children]);
        return data;
    });
};
const constants: RouteOption[] = [...auth, ...errors];
const dynamic: RouteOption[] = [
    {
        path: '/',
        page: 'layouts/master',
        access: true,
        children: addLoading([
            ...dashboard,
            ...content,
            {
                name: '组织管理',
                path: 'org',
                meta: { text: '组织管理', icon: <SmileOutlined /> },
                children: [],
            },
            {
                name: 'setting',
                path: 'setting',
                meta: { text: '设置', icon: <SmileOutlined /> },
                children: [],
            },

            {
                name: 'pages',
                path: 'pages',
                meta: { text: '页面', icon: <SmileOutlined /> },
                children: [
                    {
                        name: 'user-center',
                        meta: { text: '用户中心', icon: <SmileOutlined /> },
                    },
                    {
                        name: 'list-page',
                        meta: { text: '列表页', icon: <SmileOutlined /> },
                    },
                    {
                        name: 'form-page',
                        meta: { text: '表单页', icon: <SmileOutlined /> },
                        children: [
                            {
                                name: 'base-form',
                                meta: { text: '基础表单', icon: <SmileOutlined /> },
                            },
                            {
                                name: 'step-form',
                                meta: { text: '分步表单', icon: <SmileOutlined /> },
                            },
                            {
                                name: 'advand-form',
                                meta: { text: '高级表单', icon: <SmileOutlined /> },
                            },
                        ],
                    },
                    {
                        name: 'detail-page',
                        meta: { text: '详情页', icon: <SmileOutlined /> },
                    },
                    {
                        name: 'result-page',
                        meta: { text: '详情页', icon: <SmileOutlined /> },
                    },
                    {
                        name: 'exception-page',
                        meta: { text: '异常页', icon: <SmileOutlined /> },
                    },
                ],
            },
            {
                name: 'components',
                path: 'components',
                meta: { text: '组件', icon: <SmileOutlined /> },
                children: [],
            },
            {
                name: 'charts',
                path: 'charts',
                meta: { text: '图表', icon: <SmileOutlined /> },
            },
            {
                name: 'about',
                path: 'about',
                meta: { text: '关于', icon: <SmileOutlined /> },
                children: [],
            },
            {
                name: 'nested',
                meta: { text: '嵌套', icon: <SmileOutlined /> },
                children: [
                    {
                        name: 'nested',
                        meta: { text: '嵌套', icon: <SmileOutlined /> },
                        children: [
                            {
                                name: 'nested',
                                meta: { text: '嵌套', icon: <SmileOutlined /> },
                                children: [
                                    {
                                        name: 'nested',
                                        meta: { text: '嵌套', icon: <SmileOutlined /> },
                                        children: [
                                            {
                                                name: 'nested',
                                                meta: { text: '嵌套', icon: <SmileOutlined /> },
                                                children: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]),
    },
];

export const router: RouterConfig = {
    basePath: import.meta.env.BASE_URL,
    window: undefined,
    hash: false,
    routes: {
        constants,
        dynamic,
    },
};
