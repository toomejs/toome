import { matchPath } from 'react-router-dom';

import { Location } from 'history';

import { CSSProperties, Reducer } from 'react';

import { kebabCase } from 'lodash-es';

import classNames from 'classnames';

import produce from 'immer';

import { deepMerge, isUrl } from '@/utils';
import { MenuOption } from '@/components/Menu';

import { ThemeMode } from '../Config';

import {
    LayoutAction,
    LayoutConfig,
    LayoutContextType,
    LayoutFixed,
    LayoutMenuState,
    LayoutSplitMenuState,
    LayoutTheme,
    LayoutVarsConfig,
} from './types';
import { LayoutActionType, LayoutMode } from './constants';
import { defaultConfig } from './default.config';
/**
 * 暗黑模式下的组件背景色
 */
export const layoutDarkTheme: LayoutTheme = { header: 'light', sidebar: 'light', embed: 'light' };
/**
 * 初始化背景状态
 * @param params
 */
export const initLayoutConfig = (params: {
    /** 自定义布局配置 */
    config?: LayoutConfig;
    /** 菜单状态 */
    menu: LayoutMenuState;
    /** 全局主题模式 */
    systemTheme: `${ThemeMode}`;
}): LayoutContextType => {
    const { config, menu, systemTheme } = params;
    const data: LayoutContextType = {
        config: deepMerge(defaultConfig, config ?? {}, 'replace') as ReRequired<LayoutConfig>,
        menu,
        mobileSide: false,
    };
    // 如果全局主题为暗黑则设置默认组件背景
    if (systemTheme === 'dark') data.config.theme = layoutDarkTheme;
    return data;
};
/**
 * 布局组件状态操作
 */
export const layoutReducer: Reducer<LayoutContextType, LayoutAction> = produce((state, action) => {
    switch (action.type) {
        case LayoutActionType.CHANGE_VARS: {
            state.config.vars = { ...state.config.vars, ...action.vars };
            break;
        }
        case LayoutActionType.CHANGE_MODE: {
            state.config.mode = action.value;
            break;
        }
        case LayoutActionType.CHANGE_FIXED: {
            const newFixed = { [action.key]: action.value };
            state.config.fixed = getLayoutFixed(
                state.config.mode,
                { ...state.config.fixed, ...newFixed },
                newFixed,
            );
            break;
        }
        case LayoutActionType.CHANGE_COLLAPSE: {
            state.config.collapsed = action.value;
            break;
        }
        case LayoutActionType.TOGGLE_COLLAPSE: {
            state.config.collapsed = !state.config.collapsed;
            break;
        }
        case LayoutActionType.CHANGE_MOBILE_SIDE: {
            state.mobileSide = action.value;
            break;
        }
        case LayoutActionType.TOGGLE_MOBILE_SIDE: {
            state.mobileSide = !state.mobileSide;
            break;
        }
        case LayoutActionType.CHANGE_THEME: {
            state.config.theme = { ...state.config.theme, ...action.value };
            break;
        }
        case LayoutActionType.CHANGE_MENU: {
            state.menu = deepMerge(state.menu, action.value, 'replace');
            break;
        }
        default:
            break;
    }
});
/**
 * 获取布局页面顶级CSS类
 * @param fixed 子组件固定状态
 * @param mode 布局模式
 * @param style css module类
 * @param isMobile 是否处于移动屏幕
 */
export const getLayoutClasses = (
    fixed: LayoutFixed,
    mode: `${LayoutMode}`,
    style: CSSModuleClasses,
    isMobile: boolean,
) => {
    const items = ['!min-h-screen'];
    if (fixed.header || fixed.sidebar || fixed.embed) {
        items.push(style.layoutFixed);
    }
    switch (mode) {
        case 'side':
            if (fixed.header) items.push(style.layoutSideHeaderFixed);
            else if (fixed.sidebar) items.push(style.layoutSideSidebarFixed);
            break;
        case 'content':
            if (fixed.sidebar) items.push(style.layoutContentSidebarFixed);
            else if (fixed.header) items.push(style.layoutContentHeaderFixed);
            break;
        case 'top':
            if (fixed.header) items.push(style.layoutTopHeaderFixed);
            break;
        case 'embed':
            items.push(style.layoutEmbed);
            if (fixed.header) items.push(style.layoutEmbedHeaderFixed);
            else if (fixed.embed) items.push(style.layoutEmbedEmbedFixed);
            else if (fixed.sidebar) items.push(style.layoutEmbedSidebarFixed);
            break;
        default:
            break;
    }
    if (isMobile) items.push(style.mobileLayout);
    return classNames(items);
};
/**
 * 根据css变量状态生成真是css变量
 * @param style css变量状态
 */
export const getLayoutCssStyle = (style: Required<LayoutVarsConfig>): CSSProperties =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [
            `--${kebabCase(key)}`,
            typeof value === 'number' ? `${value}px` : value,
        ]),
    );
/**
 * 更改子组件固定模式后生成的最终固定状态
 * @param mode 布局模式
 * @param fixed 旧状态
 * @param newFixed 新状态
 */
export const getLayoutFixed = (
    mode: `${LayoutMode}`,
    fixed: LayoutFixed,
    newFixed: Partial<LayoutFixed>,
) => {
    const current = { ...fixed, ...newFixed };
    if (mode === 'side') {
        if (newFixed.header) current.sidebar = true;
        if (newFixed.sidebar !== undefined && !newFixed.sidebar) current.header = false;
    } else if (mode === 'content') {
        if (newFixed.sidebar) current.header = true;
        if (newFixed.header !== undefined && !newFixed.header) current.sidebar = false;
    } else if (mode === 'embed') {
        if (newFixed.header) {
            current.sidebar = true;
            current.embed = true;
        }
        if (newFixed.sidebar !== undefined && !newFixed.sidebar) {
            current.embed = false;
            current.header = false;
        }
        if (newFixed.embed) current.sidebar = true;
        if (newFixed.embed !== undefined && !newFixed.embed) current.header = false;
    }
    return current;
};
/**
 * 生成菜单状态
 * @param menus 菜单数据(来自菜单组件)
 * @param location 当前location对象
 * @param layoutMode 布局模式
 */
export const getMenuData = (
    menus: MenuOption[],
    location: Location,
    layoutMode: `${LayoutMode}`,
): LayoutMenuState => {
    const split: LayoutSplitMenuState = {
        data: [],
        selects: [],
    };
    let data = menus;
    // 获取选中的菜单ID
    let selects = diffKeys(getSelectMenus(data, location));
    // 获取打开的菜单ID
    let opens = diffKeys(getOpenMenus(data, selects, []));
    // 获取顶级菜单中拥有子菜单的菜单ID
    let rootSubKeys = diffKeys(data.filter((menu) => menu.children));
    if (layoutMode === 'embed') {
        split.data = menus.map((item) => {
            const { children, ...meta } = item;
            return meta;
        });
        const select = data.find((item) => selects.includes(item.id) || opens.includes(item.id));
        if (!select || !select.children) {
            opens = [];
            rootSubKeys = [];
            data = [];
        }
        if (select) {
            split.selects = [select.id];
            if (select.children) {
                data = select.children;
                selects = diffKeys(getSelectMenus(data, location));
                opens = diffKeys(getOpenMenus(data, selects, []));
                rootSubKeys = diffKeys(data.filter((menu) => menu.children));
            }
        }
    }
    return {
        data,
        opens,
        selects,
        rootSubKeys,
        split,
    };
};
const diffKeys = (menus: MenuOption[]) => menus.map((menu) => menu.id);
const getSelectMenus = (menus: MenuOption[], location: Location): MenuOption[] =>
    menus
        .map((menu) => {
            if (menu.children) return getSelectMenus(menu.children, location);
            if (
                menu.path &&
                !isUrl(menu.path) &&
                matchPath(menu.path, location.pathname) &&
                !menu.path.endsWith('*')
            ) {
                return [menu];
            }
            return [];
        })
        .reduce((o, n) => [...o, ...n], []);
const getOpenMenus = (
    menus: MenuOption[],
    selects: string[],
    parents: MenuOption[],
): MenuOption[] => {
    return menus
        .map((menu) => {
            if (!menu.children) return selects.includes(menu.id) ? [...parents] : [];
            return getOpenMenus(menu.children, selects, [...parents, menu]);
        })
        .reduce((o, n) => [...o, ...n], []);
};
