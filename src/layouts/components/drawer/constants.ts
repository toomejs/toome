import { LayoutMode } from '@/components/Config';
import type { ColorConfig } from '@/components/Config';

export enum LayoutTheme {
    DarkLight = 'dark-light',
    LightDark = 'light-dark',
    LIGHTLIGHT = 'light-light',
    DARKDARK = 'dark-dark',
}
export const LayoutModeList: Array<{ title: string; type: `${LayoutMode}` }> = [
    {
        title: '左侧菜单',
        type: LayoutMode.SIDE,
    },
    {
        title: '左侧菜单+顶部LOGO',
        type: LayoutMode.CONTENT,
    },

    {
        title: '顶部菜单',
        type: LayoutMode.TOP,
    },
    {
        title: '嵌入双菜单',
        type: LayoutMode.EMBED,
    },
];

export const LayoutThemeList: Array<{ title: string; type: `${LayoutTheme}` }> = [
    {
        title: '左侧暗-顶部亮',
        type: LayoutTheme.DarkLight,
    },
    {
        title: '左侧亮-顶部暗',
        type: LayoutTheme.LightDark,
    },

    {
        title: '左侧亮-顶部亮',
        type: LayoutTheme.LIGHTLIGHT,
    },
    {
        title: '左侧暗-顶部暗',
        type: LayoutTheme.DARKDARK,
    },
];
export const ColorList: Array<{ title: string; type: keyof ColorConfig }> = [
    {
        title: '主色',
        type: 'primary',
    },
    {
        title: '信息',
        type: 'info',
    },
    {
        title: '成功',
        type: 'success',
    },
    {
        title: '错误',
        type: 'error',
    },
    {
        title: '警告',
        type: 'warning',
    },
];
