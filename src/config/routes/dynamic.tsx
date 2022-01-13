import type { RouteOption } from '@/components/Router';

import { addLoading } from './loading';

import MonitorIcon from '~icons/carbon/airplay-filled';
import ContentIcon from '~icons/fluent/cube-16-regular';
import MediaIcon from '~icons/icon-park-outline/solid-state-disk';
import SettingIcon from '~icons/clarity/settings-outline-alerted';
import ChartIcon from '~icons/mdi-light/chart-bar';
import DemoIcon from '~icons/ri/apps-line';

export const dynamicRoutes = () => [
    {
        path: '/',
        page: 'layouts/master',
        access: true,
        children: addLoading([...dashboard, account, content, media, setting, charts, links, demo]),
    },
];

const dashboard: RouteOption[] = [
    {
        index: true,
        to: '/dashboard/monitor',
    },
    {
        name: 'dashboard',
        meta: { text: '仪表盘', icon: MonitorIcon },
        children: [
            {
                name: 'dashboard.monitor',
                path: 'dashboard/monitor',
                page: 'dashboard/monitor/index',
                meta: { text: '监控页' },
            },
            {
                name: 'dashboard.anlysis',
                path: 'dashboard/anlysis',
                page: 'dashboard/monitor/index',
                meta: { text: '分析页' },
            },
            {
                name: 'dashboard.workbench',
                path: 'dashboard/workbench',
                page: 'dashboard/monitor/index',
                meta: { text: '工作台' },
            },
        ],
    },
];
const account: RouteOption = {
    path: 'account',
    children: [
        {
            name: 'center',
            page: 'account/center/index',
            meta: { text: '个人中心', hide: true },
        },
        {
            name: 'setting',
            page: 'account/setting/index',
            meta: { text: '账户设置', hide: true },
        },
    ],
};
const content: RouteOption = {
    name: 'content',
    path: 'content',
    meta: { text: '内容管理', icon: ContentIcon },
    children: [
        {
            name: 'content.index',
            index: true,
            to: '/content/articles',
            meta: { hide: true },
        },
        {
            name: 'articles.list',
            path: 'articles',
            page: 'content/articles/list',
            meta: { text: '文章管理' },
        },
        {
            name: 'articles.create',
            path: 'create',
            page: 'content/articles/create',
            meta: { text: '新增文章', hide: true },
        },
        {
            path: 'categories',
            name: 'articles.list',
            page: 'content/categories/list',
            meta: { text: '分类管理' },
        },
        {
            path: 'tags',
            name: 'articles.list',
            page: 'content/tags/list',
            meta: { text: '标签管理' },
        },
        {
            path: 'comments',
            name: 'articles.list',
            page: 'content/comments/list',
            meta: { text: '评论管理' },
        },
    ],
};
const media: RouteOption = {
    path: 'media',
    name: 'media',
    page: 'media/index',
    meta: { text: '文件管理', icon: MediaIcon },
};
const setting: RouteOption = {
    path: 'setting',
    name: 'setting',
    page: 'setting/index',
    meta: { text: '系统设置', icon: SettingIcon },
};

const charts: RouteOption = {
    name: 'charts',
    meta: { text: '图表演示', icon: ChartIcon },
    children: [
        {
            name: 'percent',
            path: 'charts/percent',
            meta: { text: '百分比' },
            page: 'charts/percent',
        },
        {
            name: 'line',
            path: 'charts/line',
            meta: { text: '折线图' },
            page: 'charts/line',
        },
        {
            name: 'wave',
            path: 'charts/wave',
            meta: { text: '水波图' },
            page: 'charts/wave',
        },
    ],
};
const links: RouteOption = {
    name: 'links',
    path: 'links',
    meta: { text: '外部链接', icon: ChartIcon },
    children: [
        {
            name: 'links.inset',
            path: 'inset',
            to: 'https://pincman.com',
            meta: { text: '内嵌' },
        },
        {
            name: 'links.blank',
            path: 'https://baidu.com',
            meta: { text: '新窗口', target: '_blank' },
        },
    ],
};
const demo: RouteOption = {
    name: 'demo',
    meta: { text: '示例页面', icon: DemoIcon },
    children: [
        {
            name: 'account-age',
            meta: { text: '个人页' },
            children: [
                {
                    name: 'account.center',
                    meta: { text: '用户中心' },
                    page: 'account/center/index',
                },
                {
                    name: 'account.setting',
                    meta: { text: '用户设置' },
                    page: 'account/setting/index',
                },
            ],
        },
        {
            name: 'list-page',
            meta: { text: '列表页' },
            children: [
                {
                    name: 'basic.list',
                    meta: { text: '标准列表' },
                },
                {
                    name: 'search.list',
                    meta: { text: '搜索列表' },
                },
                {
                    name: 'table.list',
                    meta: { text: '查询表格' },
                },
                {
                    name: 'card.list',
                    meta: { text: '卡片列表' },
                },
            ],
        },
        {
            name: 'form-page',
            meta: { text: '表单页' },
            children: [
                {
                    name: 'base.form',
                    meta: { text: '基础表单' },
                },
                {
                    name: 'step.form',
                    meta: { text: '分步表单' },
                },
                {
                    name: 'advand.form',
                    meta: { text: '高级表单' },
                },
            ],
        },
        {
            name: 'detail-page',
            meta: { text: '详情页' },
            children: [
                {
                    name: 'base.detail',
                    meta: { text: '基础详情页' },
                },
                {
                    name: 'advanced.detail',
                    meta: { text: '高级详情页' },
                },
            ],
        },
        {
            name: 'result-page',
            meta: { text: '结果页' },
            children: [
                {
                    name: 'success.result',
                    meta: { text: '成功页' },
                },
                {
                    name: 'fail.result',
                    meta: { text: '失败页' },
                },
            ],
        },
        {
            name: 'exception-page',
            meta: { text: '异常页' },
            children: [
                {
                    name: '403.exception',
                    meta: { text: '403' },
                    page: 'errors/403',
                },
                {
                    name: '404.exception',
                    meta: { text: '404' },
                    page: 'errors/404',
                },
                {
                    name: '500.exception',
                    meta: { text: '500' },
                    page: 'errors/500',
                },
            ],
        },
    ],
};
