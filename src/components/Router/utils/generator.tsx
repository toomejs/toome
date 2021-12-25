import type { AxiosInstance } from 'axios';
import { isArray, omit, pick, trim } from 'lodash-es';
import type { ReactElement } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

import { isUrl } from '@/utils';

import type { Permission, User } from '@/components/Auth';
import { getUser } from '@/components/Auth';

import { useRouterStore } from '../hooks/store';

import type { ParentRouteProps, RouteOption, RouterState, WhiteRoute } from '../types';

import { formatPath } from './helpers';
import { AuthRedirect, getAsyncPage } from './views';

const checkInWhiteList = (
    route: RouteOption,
    parent: Omit<ParentRouteProps, 'index'>,
    loginPath: string,
    whiteList: WhiteRoute[],
): boolean => {
    const current: Omit<ParentRouteProps, 'index'> = {
        ...parent,
        basePath: parent.basePath,
    };
    const currentPath = formatPath(route, parent.basePath, parent.path);
    if (trim(currentPath, '/') === trim(loginPath, '/')) return true;
    current.path = currentPath;
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
            .map((c) => checkInWhiteList(c, current, loginPath, whiteList))
            .filter((c) => !!c).length > 0
    );
};

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
            const currentPath = formatPath(route, parent.basePath, parent.path);
            current.path = currentPath;
            if (
                'path' in route &&
                authConfig.redirect === 'login' &&
                trim(route.path, '/') === '*'
            ) {
                return undefined;
            }
            if (!checkInWhiteList(route, parent, authConfig.login_path, authConfig.white_list)) {
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
export const filteAccessRoutes = (
    user: User | null,
    routes: RouteOption[],
    authConfig: RouterState['auth'],
    parent: Omit<ParentRouteProps, 'index'>,
): RouteOption<RecordNever>[] => {
    const roleColumn = authConfig.role_column;
    const permColumn = authConfig.permission_column;
    const loginPath = authConfig.login_path;
    const whiteList = authConfig.white_list;
    let userRoles: Array<Permission<RecordNever>> = [];
    let userPerms: Array<Permission<RecordNever>> = [];
    if (user) {
        if (user.roles) userRoles = user.roles;
        if (user.permissions) userPerms = user.permissions;
    }
    const roles = userRoles
        .filter((r) => r[roleColumn] && typeof r[roleColumn] === 'string')
        .map((p) => p[permColumn] as string);
    const permissions = userPerms
        .filter((p) => p[permColumn] && typeof p[permColumn] === 'string')
        .map((p) => p[permColumn] as string);
    return routes
        .filter((route) => {
            if (checkInWhiteList(route, parent, loginPath, whiteList)) return true;
            const access = route.access ?? false;
            if (typeof access === 'boolean') return access ? !!user : true;
            const routeRoles = access.roles ?? [];
            const routePerms = access.permissions ?? [];

            if (routeRoles.length <= 0 && routePerms.length <= 0) return true;
            if (routeRoles.length > 0 && routeRoles.some((r) => roles.includes(r))) {
                return true;
            }
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
                children: filteAccessRoutes(user, route.children, authConfig, current),
            };
        });
};

export const factoryRoutes = async (fetcher: AxiosInstance) => {
    const user = getUser();
    const { config } = useRouterStore.getState();
    useRouterStore.setState((state) => {
        state.signal.shouldChange = false;
        state.signal.canGenerate = false;
        state.signal.generated = false;
    });
    if (!config.auth.enabled) {
        useRouterStore.setState((state) => {
            state.routes = [...state.config.routes.constants, ...state.config.routes.dynamic];
            state.signal.canGenerate = true;
        });
    } else if (user) {
        useRouterStore.setState((state) => {
            state.routes = filteAccessRoutes(user, state.config.routes.constants, config.auth, {
                basePath: config.basePath,
            });
        });
        if (!config.server) {
            useRouterStore.setState((state) => {
                state.routes = filteAccessRoutes(
                    user,
                    [...state.routes, ...state.config.routes.dynamic],
                    config.auth,
                    {
                        basePath: config.basePath,
                    },
                );
                state.signal.canGenerate = true;
            });
        } else {
            try {
                const { data } = await fetcher.get<RouteOption[]>(config.server);
                if (isArray(data)) {
                    useRouterStore.setState((state) => {
                        state.routes = [...state.routes, ...data];
                        state.signal.canGenerate = true;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        useRouterStore.setState((state) => {
            state.routes = [
                ...filteWhiteList(state.config.routes.constants, config.auth, {
                    basePath: config.basePath,
                }),
                ...filteWhiteList(state.config.routes.dynamic, config.auth, {
                    basePath: config.basePath,
                }),
            ];
            state.signal.shouldChange = false;
            state.signal.canGenerate = true;
        });
    }
};

export const generateRoutes = (children: RouteOption[], parent: ParentRouteProps) => {
    let nameMaps: Record<string, string> = {};
    const routes = children
        .map((item, index) => {
            const route: RouteObject = { ...omit(item, ['page', 'children']) };
            const current: ParentRouteProps = {
                ...parent,
                basePath: parent.basePath,
                index: parent.index ? `${parent.index}.${index.toString()}` : index.toString(),
            };
            const isRoute =
                ('path' in item && item.path && !isUrl('path')) || 'index' in item || 'to' in item;
            if (isRoute) {
                const currentPath = formatPath(item, parent.basePath, parent.path);
                current.path = currentPath;
                // 当前项是一个跳转路由
                const isRedirectRoute = 'to' in item;
                if (item.name) {
                    nameMaps[item.name] = current.path;
                }
                // 当前项是一个跳转路由
                if (isRedirectRoute) {
                    route.element = <Navigate {...pick(item, ['to', 'state'])} replace />;
                    // 当前项是一个页面路由
                } else if ('page' in item && item.page) {
                    if (typeof item.page === 'string') {
                        const AsyncPage = getAsyncPage({
                            page: item.page as string,
                            cacheKey: item.cacheKey ?? item.name ?? current.index!,
                            loading: item.loading,
                        });
                        route.element = <AsyncPage />;
                    } else {
                        route.element = item.page;
                    }
                } else {
                    route.element = <Outlet />;
                }
                if (current.render) {
                    route.element = current.render(
                        current.basePath,
                        item,
                        route.element as ReactElement,
                    );
                }
            }
            if (!item.children?.length) delete item.children;
            if (item.children) {
                const rst = generateRoutes(item.children, current);
                nameMaps = { ...nameMaps, ...rst.nameMaps };
                if (isRoute) route.children = rst.routes;
                else return rst.routes;
            }
            return [route];
        })
        .reduce((o, n) => [...o, ...n], []) as RouteObject[];
    return { routes, nameMaps };
};

export const generateFinalRoutes = () => {
    const user = getUser();
    const { config, routes } = useRouterStore.getState();
    const { nameMaps, routes: renders } = generateRoutes(routes, {
        basePath: config.basePath,
        render: config.render,
    });
    useRouterStore.setState((state) => {
        state.names = nameMaps;
        state.renders = renders;
        if (state.config.auth.enabled && !user && state.config.auth.redirect === 'login') {
            state.renders.push({
                path: '*',
                element: <AuthRedirect loginPath={state.config.auth.login_path} />,
            });
        }
        state.signal.canGenerate = false;
        state.signal.generated = true;
    });
};
