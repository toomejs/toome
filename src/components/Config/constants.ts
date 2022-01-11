/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2022-01-02 18:30:16 +0800
 * @Updated_at     : 2022-01-10 14:00:51 +0800
 * @Path           : /src/components/Config/constants.ts
 * @Description    : 配置组件常量
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
/**
 * 主题切换依赖
 * 注意OS和TIME与手动切换并不冲突,但OS与TIME两者只能选择一个
 */
export enum ThemeDepend {
    /** 跟随操作系统 */
    OS = 'os',
    /** 跟随时间范围 */
    TIME = 'time',
    /** 只能手动切换 */
    MANUAL = 'manual',
}
/**
 * 主题模式
 */
export enum ThemeMode {
    /** 明亮 */
    LIGHT = 'light',
    /** 暗黑 */
    DARK = 'dark',
}
// export enum LayoutMode {
//     TOP = 'top',
//     SIDE = 'side',
//     CONTENT = 'content',
//     EMBED = 'embed',
// }
// export enum LayoutComponent {
//     HEADER = 'header',
//     SIDEBAR = 'sidebar',
//     EMBED = 'embed',
// }
