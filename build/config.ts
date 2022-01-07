/* eslint-disable import/no-extraneous-dependencies */
import merge from 'deepmerge';
import { ConfigEnv, UserConfig } from 'vite';
import { getThemeVariables } from 'antd/dist/theme';

import { getPlugins } from './plugins';
import { createProxy } from './proxy';

import { Configure } from './types';
import { pathResolve } from './utils';

export const getConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
    const modifyVars = getThemeVariables();
    console.log(modifyVars.hack);
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
                        modifyVars: {
                            hack: `true;@import (reference) "${pathResolve(
                                'src/styles/antd.less',
                            )}";`,
                        },
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
