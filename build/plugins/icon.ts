import path from 'path';

import viteSvgIcons from 'vite-plugin-svg-icons';

export function configSvgIconPlugin() {
    return viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // 指定symbolId格式
        symbolId: 'svg-[dir]-[name]',
    });
}
