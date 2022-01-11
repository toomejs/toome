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
        ],
    },
];
