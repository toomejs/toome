/* eslint-disable import/no-extraneous-dependencies */
import { getThemeVariables } from 'antd/dist/theme';
import merge from 'deepmerge';
import { ConfigEnv, UserConfig } from 'vite';

import { getPlugins } from './plugins';
import { createProxy } from './proxy';

import { Configure } from './types';
import { pathResolve } from './utils';

export const getConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
    return merge<UserConfig>(
        {
            resolve: {
                alias: {
                    '@': pathResolve('src'),
                    '~antd': 'antd',
                    '~@ant-design': '@ant-design',
                },
            },
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly',
                },
                preprocessorOptions: {
                    less: {
                        javascriptEnabled: true,
                        modifyVars: { ...getThemeVariables(), '@primary-color': '#1DA57A' },
                    },
                },
            },
            plugins: getPlugins(isBuild),
            server: {
                host: true,
                port: 3100,
                proxy: createProxy([
                    ['/api', 'http://localhost:3000'],
                    ['/upload', 'http://localhost:3300/upload'],
                ]),
            },
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    );
};
