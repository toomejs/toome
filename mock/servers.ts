import type { ServerItem } from '@/views/dashboard/monitor/types';

import { RequestParams, resultError } from './_util';
import type { MockItem } from './types';

export const servers: ServerItem[] = [
    {
        id: '1',
        os: 'Debian Bullseye 11.2 64bit',
        cpu: 4,
        memory: 16 * 1024,
        disk: [
            { path: '/', value: 50 * 1024 },
            { path: '/data', value: 100 * 1024 },
        ],
        status: 'running',
        insetIp: '10.120.118.4',
        publicIp: ' 139.198.177.23',
    },
];
export default [
    {
        url: '/api/servers',
        method: 'get',
        response(request: RequestParams) {
            const id = request.query?.id;
            if (!id) return servers;
            const server = servers.find((s) => s.id === id);
            if (!server) {
                (this.res as any).statusCode = 500;
                return resultError('server not exits!');
            }
            return server;
        },
    },
] as MockItem[];
