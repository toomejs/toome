import path from 'path';

import viteSvgIcons from 'vite-plugin-svg-icons';
// import Icons from 'unplugin-icons/vite';

export function configIconPlugin(isBuild: boolean) {
    return viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        svgoOptions: isBuild,
        // 指定symbolId格式
        symbolId: 'svg-[dir]-[name]',
    });
    // Icons({ compiler: 'jsx' }),
    // ];
}
