import react from '@vitejs/plugin-react';
import { PluginOption } from 'vite';

import { configAntdPlugin } from './antd';
import { configMockPlugin } from './mock';

export function getPlugins(isBuild: boolean) {
    const vitePlugins: (PluginOption | PluginOption[])[] = [];
    vitePlugins.push(react());
    vitePlugins.push(configMockPlugin(isBuild));
    if (isBuild) vitePlugins.push(configAntdPlugin(isBuild));
    return vitePlugins;
}
