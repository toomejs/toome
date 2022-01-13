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
import { AxiosInstance } from 'axios';
import { isArray, trim } from 'lodash-es';

import { getUser, Permission, User } from '@/components/Auth';

import { RouterStatus, RouterStore } from '../store';

import { RouteOption, ParentRouteProps, RouterState, WhiteRoute } from '../types';

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

import { formatPath } from './helpers';
import { generateFinalRoutes } from './generator';

/**
 * 构建用户生成路由渲染的路由列表
 * @param fetcher 远程Request对象
 */
export const factoryRoutes = async (fetcher: AxiosInstance) => {
    const user = getUser();
    const { config } = RouterStore.getState();
    RouterStatus.setState((state) => ({ ...state, next: false, ready: false, success: false }));
    // 如果没有启用auth功能则使用配置中路由直接开始生成
    if (!config.auth.enabled) {
        RouterStore.setState((state) => {
            state.routes = [...state.config.routes.constants, ...state.config.routes.dynamic];
        });
        generateFinalRoutes();
        // RouterStatus.setState((state) => {
        //     state.ready = true;
        // });
    } else if (user) {
        // 如果用户已登录,首先过滤精通路由
        RouterStore.setState((state) => {
            state.routes = filteAccessRoutes(user, state.config.routes.constants, config.auth, {
                basePath: config.basePath,
            });
        });
        if (!config.server) {
            // 如果路由通过配置生成则直接过滤动态路由并合并已过滤的静态路由
            RouterStore.setState((state) => {
                state.routes = filteAccessRoutes(
                    user,
                    [...state.routes, ...state.config.routes.dynamic],
                    config.auth,
                    {
                        basePath: config.basePath,
                    },
                );
            });
            generateFinalRoutes();
            // RouterStatus.setState((state) => {
            //     state.ready = true;
            // });
        } else {
            try {
                // 如果路由通过服务器生成则直接合并已过滤的动态路由(权限过滤由服务端搞定)
                const { data } = await fetcher.get<RouteOption[]>(config.server);
                if (isArray(data)) {
                    RouterStore.setState((state) => {
                        state.routes = [...state.routes, ...data];
                    });
                    RouterStatus.setState((state) => {
                        state.ready = true;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        // 如果没有登录用户则根据白名单和路由项中的access为false来生成路由
        RouterStore.setState((state) => {
            state.routes = [
                ...filteWhiteList(state.config.routes.constants, config.auth, {
                    basePath: config.basePath,
                }),
                ...filteWhiteList(state.config.routes.dynamic, config.auth, {
                    basePath: config.basePath,
                }),
            ];
        });
        generateFinalRoutes();
        RouterStatus.setState((state) => ({ ...state, next: false }));
        // RouterStatus.setState((state) => ({ ...state, next: false, ready: true }));
    }
};

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
            const currentPath = formatPath(route, parent.basePath, parent.path);
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
const filteWhiteList = (
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
            const currentPath = formatPath(route, parent.basePath, parent.path);
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
    const currentPath = formatPath(route, parent.basePath, parent.path);
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
