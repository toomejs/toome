import styleImport from 'vite-plugin-style-import';

export function configAntdPlugin(isBuild: boolean) {
    // if (!isBuild) return [];
    const antdPlugin = styleImport({
        libs: [
            {
                libraryName: 'antd',
                esModule: true,
                resolveStyle: (name) => {
                    return `antd/es/${name}/style/index`;
                },
            },
        ],
    });
    return antdPlugin;
}
