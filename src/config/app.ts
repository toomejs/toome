import type { ConfigProps } from '@/components/Config';

export const config: ConfigProps = {
    timezone: 'UTC',
    theme: {
        mode: 'light',
        depend: 'manual',
        // range: {
        //     light: timer({ date: '07:30', format: 'HH:mm' }).format(),
        //     dark: timer({ date: '18:30', format: 'HH:mm' }).format(),
        // },
    },
    colors: {
        primary: '#1890ff',
        info: '#00adb5',
        success: '#52c41a',
        error: '#ff4d4f',
        warning: '#faad14',
    },
};
