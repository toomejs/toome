import type { ServerStatusOption } from './types';

export enum ServerStatus {
    RUNNING = 'running',
    RESTARTING = 'restarting',
    SHUTDOWN = 'shutdown',
}
export const serverStatus: ServerStatusOption = {
    running: { text: '运行中', badge: 'success' },
    restarting: { text: '重启中', badge: 'processing' },
    shutdown: { text: '已关机', badge: 'default' },
};
