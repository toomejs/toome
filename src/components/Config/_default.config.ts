/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-29 11:55:02 +0800
 * @Updated_at     : 2022-01-10 14:05:52 +0800
 * @Path           : /src/components/Config/_default.config.ts
 * @Description    : 默认配置
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */

import { ConfigStoreType } from './types';

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
        info: '#00adb5',
        success: '#52c41a',
        error: '#ff4d4f',
        warning: '#faad14',
    },
    // layout: {
    //     mode: 'side',
    //     collapsed: false,
    //     theme: {
    //         header: 'light',
    //         sidebar: 'dark',
    //         embed: 'light',
    //     },
    //     fixed: {
    //         header: false,
    //         sidebar: false,
    //         embed: false,
    //     },
    // },
};
