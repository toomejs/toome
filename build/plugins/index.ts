import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import { PluginOption } from 'vite';

import { configAntdPlugin } from './antd';
import { configIconPlugin } from './icon';
import { configMockPlugin } from './mock';
import { configThemePlugin } from './theme';
// import { configWindiCssPlugin } from './windicss';

export function getPlugins(isBuild: boolean) {
    const vitePlugins: (PluginOption | PluginOption[])[] = [];
    vitePlugins.push(react());
    vitePlugins.push(configMockPlugin(isBuild));
    vitePlugins.push(configIconPlugin(isBuild));
    vitePlugins.push(Icons({ compiler: 'jsx', jsx: 'react' }));
    if (isBuild) vitePlugins.push(configAntdPlugin(isBuild));
    vitePlugins.push(configThemePlugin(isBuild));
    // vitePlugins.push(configWindiCssPlugin());
    return vitePlugins;
}
