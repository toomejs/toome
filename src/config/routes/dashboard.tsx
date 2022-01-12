import { SmileOutlined } from '@ant-design/icons';

import type { RouteOption } from '@/components/Router';

export const dashboard: RouteOption[] = [
    {
        index: true,
        to: '/dashboard/monitor',
    },
    {
        name: 'dashboard',
        meta: { text: '仪表盘', icon: <SmileOutlined /> },
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
