import { matchPath } from 'react-router-dom';

import type { Location } from 'history';

import type { CSSProperties } from 'react';

import { kebabCase } from 'lodash-es';

import classNames from 'classnames';

import { isUrl } from '@/utils';
import type { MenuOption } from '@/components/Menu';

import type {
    LayoutMode,
    ThemeMode,
    LayoutConfig,
    LayoutFixed,
    LayoutTheme,
} from '@/components/Config';

import type { LayoutEmbedMenuState, LayoutMenuState, LayoutState, LayoutVarsConfig } from './types';

export const layoutDarkTheme: LayoutTheme = { header: 'dark', sidebar: 'light', embed: 'light' };
export const initLayoutConfig = (params: {
    config: ReRequired<LayoutConfig>;
    menu: LayoutMenuState;
    systemTheme: `${ThemeMode}`;
    vars: Required<LayoutVarsConfig>;
    isMobile: boolean;
}): LayoutState => {
    const { config, menu, systemTheme, vars, isMobile } = params;
    const data: LayoutState = { ...config, menu, vars };
    if (systemTheme === 'dark') data.theme = layoutDarkTheme;
    if (isMobile) data.vars.sidebarCollapseWidth = 0;
    return data;
};

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
export const getVars = (vars: Required<LayoutVarsConfig>, isMobile: boolean) => {
    const current = { ...vars };
    current.sidebarCollapseWidth = isMobile ? 0 : current.sidebarCollapseWidth;
    // current.sidebarWidth = isMobile ? 0 : current.sidebarWidth;
    return current;
};
export const getLayoutCssStyle = (style: Required<LayoutVarsConfig>): CSSProperties =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [
            `--${kebabCase(key)}`,
            typeof value === 'number' ? `${value}px` : value,
        ]),
    );

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

export const getMenuData = (
    menus: MenuOption[],
    location: Location,
    layoutMode: `${LayoutMode}`,
) => {
    const embed: LayoutEmbedMenuState = {
        data: [],
        selects: [],
    };
    let data = menus;
    let selects = diffKeys(getSelectMenus(data, location));
    let opens = diffKeys(getOpenMenus(data, selects, []));
    let rootSubKeys = diffKeys(data.filter((menu) => menu.children));
    if (layoutMode === 'embed') {
        embed.data = menus.map((item) => {
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
            embed.selects = [select.id];
            if (select.children) {
                data = select.children;
                selects = diffKeys(getSelectMenus(data, location));
                opens = diffKeys(getOpenMenus(data, selects, []));
                rootSubKeys = diffKeys(data.filter((menu) => menu.children));
            }
        }
    }
    return {
        mode: layoutMode,
        data,
        opens,
        selects,
        rootSubKeys,
        embed,
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
