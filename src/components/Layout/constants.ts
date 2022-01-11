/**
 * 布局模式
 */
export enum LayoutMode {
    /** 只有顶栏导航 */
    TOP = 'top',
    /** 侧边导航,顶栏自定义 */
    SIDE = 'side',
    /** 同side,但是LOGO在顶栏 */
    CONTENT = 'content',
    /** 内嵌双导航,侧边折叠 */
    EMBED = 'embed',
}
/**
 * 布局组件
 */
export enum LayoutComponent {
    /** 顶栏 */
    HEADER = 'header',
    /** 侧边栏 */
    SIDEBAR = 'sidebar',
    /** 内嵌导航,只在mode为embed时生效 */
    EMBED = 'embed',
}
export enum LayoutActionType {
    /** 更改组件固定 */
    CHANGE_FIXED = 'change_fixed',
    /** 更改CSS变量 */
    CHANGE_VARS = 'change_vars',
    /** 更改布局模式 */
    CHANGE_MODE = 'change_mode',
    /** 重置菜单 */
    CHANGE_MENU = 'change_menu',
    /** 更改组件主题 */
    CHANGE_THEME = 'change_theme',
    /** 更改侧边缩进 */
    CHANGE_COLLAPSE = 'change_collapse',
    /** 反转侧边缩进 */
    TOGGLE_COLLAPSE = 'toggle_collapse',
    /** 更改移动模式下的侧边缩进 */
    CHANGE_MOBILE_SIDE = 'change_mobile_side',
    /** 反转移动模式下的侧边缩进 */
    TOGGLE_MOBILE_SIDE = 'toggle_mobile_side',
}
