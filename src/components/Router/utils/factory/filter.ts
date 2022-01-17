/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-14 00:07:50 +0800
 * Updated_at     : 2022-01-13 22:08:22 +0800
 * Path           : /src/components/Router/utils/generator.tsx
 * Description    : 路由生成函数
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { trim } from 'lodash-es';

import { Permission, User } from '@/components/Auth';

import { RouteOption, ParentRouteProps, RouterState, WhiteRoute } from '../../types';

/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-14 00:07:50 +0800
 * Updated_at     : 2022-01-13 22:08:22 +0800
 * Path           : /src/components/Router/utils/generator.tsx
 * Description    : 路由生成函数
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */

import { mergeRoutePath } from '../helpers';

/**
 * 根据角色和权限过滤路由
 * @param user 登录账户信息
 * @param routes 路由列表
 * @param authConfig 权限保护配置
 * @param parent 父级配置
 */
export const filteAccessRoutes = (
    user: User | null,
    routes: RouteOption[],
    authConfig: RouterState['auth'],
    parent: Omit<ParentRouteProps, 'index'>,
): RouteOption<RecordNever>[] => {
    const roleColumn = authConfig.role_column;
    const permColumn = authConfig.permission_column;
    const loginPath = authConfig.login_redirect;
    const whiteList = authConfig.white_list;
    // 用户角色对象
    let userRoles: Array<Permission<RecordNever>> = [];
    // 用户权限对象
    let userPerms: Array<Permission<RecordNever>> = [];
    if (user) {
        if (user.roles) userRoles = user.roles;
        if (user.permissions) userPerms = user.permissions;
    }
    // 用户角色名称
    const roles = userRoles
        .filter((r) => r[roleColumn] && typeof r[roleColumn] === 'string')
        .map((p) => p[permColumn] as string);
    // 用户权限名称
    const permissions = userPerms
        .filter((p) => p[permColumn] && typeof p[permColumn] === 'string')
        .map((p) => p[permColumn] as string);
    return routes
        .filter((route) => {
            const access = route.access ?? true;
            // 忽略处于白名单中或者access为false的路由
            if (checkInWhiteList(route, parent, whiteList, loginPath) || !access) return true;
            // 如果access为true则只要登录用户就能访问
            if (typeof access === 'boolean' && access) return !!user;
            // 如果有角色或权限配置,无论是否为空数组都需要至少登录才能访问
            const routeRoles = access.roles ?? [];
            const routePerms = access.permissions ?? [];
            if (routeRoles.length <= 0 && routePerms.length <= 0) return true;
            // 当前用户满足一个角色即可访问
            if (routeRoles.length > 0 && routeRoles.some((r) => roles.includes(r))) {
                return true;
            }
            // 当前用户满足一个权限即可访问
            if (routePerms.length > 0 && routePerms.some((p) => permissions.includes(p))) {
                return true;
            }
            return false;
        })
        .map((route) => {
            const current: Omit<ParentRouteProps, 'index'> = {
                ...parent,
                basePath: parent.basePath,
            };
            const currentPath = mergeRoutePath(route, parent.basePath, parent.path);
            current.path = currentPath;
            if (!route.children) return route;
            return {
                ...route,
                // 递归子路由
                children: filteAccessRoutes(user, route.children, authConfig, current),
            };
        });
};
/**
 * 过滤出路由列表中的白名单
 * @param routes 路由列表
 * @param authConfig 权限保护配置
 * @param parent 父级配置
 */
export const filteWhiteList = (
    routes: RouteOption[],
    authConfig: RouterState['auth'],
    parent: Omit<ParentRouteProps, 'index'>,
): RouteOption[] => {
    return routes
        .map((route) => {
            const current: Omit<ParentRouteProps, 'index'> = {
                ...parent,
                basePath: parent.basePath,
            };
            const currentPath = mergeRoutePath(route, parent.basePath, parent.path);
            current.path = currentPath;
            // 把所有根路径下的通配符路径移除白名单
            if ('path' in route && authConfig.login_redirect && trim(route.path, '/') === '*') {
                return undefined;
            }
            const inWhiteList = checkInWhiteList(
                route,
                parent,
                authConfig.white_list,
                authConfig.login_redirect,
            );
            const access = route.access ?? true;
            if (!inWhiteList && access) {
                return undefined;
            }
            if (!route.children) return route;
            return {
                ...route,
                children: filteWhiteList(route.children, authConfig, current),
            };
        })
        .filter((r) => r !== undefined) as RouteOption[];
};
/**
 * 检测路由是否在白名单中
 * @param route 待检测路由
 * @param parent 父级配置
 * @param whiteList 白名单列表
 * @param loginPath 登录跳转路由
 */
const checkInWhiteList = (
    route: RouteOption,
    parent: Omit<ParentRouteProps, 'index'>,
    whiteList: WhiteRoute[],
    loginPath?: string | null,
): boolean => {
    const current: Omit<ParentRouteProps, 'index'> = {
        ...parent,
        basePath: parent.basePath,
    };
    // 获取当前检测路由的完整路径
    const currentPath = mergeRoutePath(route, parent.basePath, parent.path);
    // 如果是登录跳转路径则为白名单路径
    if (loginPath && trim(currentPath, '/') === trim(loginPath, '/')) return true;
    current.path = currentPath;
    // 满足其中一项(完整路径在白名单中,路由名称在白名单中,路由路径在白名单中),则为白名单路径
    const finded = whiteList.find((w) => {
        if (typeof w === 'string') return trim(w, '/') === trim(current.path, '/');
        if ('path' in w) return trim(w.path, '/') === trim(current.path, '/');
        if ('name' in w && route.name) return route.name === w.name;
        return false;
    });
    if (finded) return true;
    if (!route.children) return false;
    return (
        route.children
            .map((c) => checkInWhiteList(c, current, whiteList, loginPath))
            .filter((c) => !!c).length > 0
    );
};
