import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import type { ConfigStoreType } from './types';

dayjs.extend(customParseFormat);

export const defaultConfig: ConfigStoreType['config'] = {
    timezone: 'UTC',
    theme: {
        mode: 'light',
        depend: 'manual',
        range: {
            light: '07:30',
            dark: '18:30',
        },
        darken: {
            theme: {
                brightness: 100,
                contrast: 90,
                sepia: 10,
            },
            fixes: {
                invert: [],
                css: '',
                ignoreInlineStyle: [],
                ignoreImageAnalysis: [],
                disableStyleSheetsProxy: true,
            },
        },
    },
    colors: {
        primary: '#1890ff',
        info: '#1890ff',
        success: '#52c41a',
        error: '#ff4d4f',
        warning: '#faad14',
    },
    layout: {
        mode: 'side',
        collapsed: false,
        theme: {
            header: 'light',
            sidebar: 'dark',
            embed: 'light',
        },
        fixed: {
            header: false,
            sidebar: false,
            embed: false,
        },
    },
};
