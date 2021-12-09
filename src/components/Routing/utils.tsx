import loadable from '@loadable/component';

import { omit, pick, trim } from 'lodash-es';
import type { FC, ReactElement } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

import { isUrl } from '@/utils/tools';

import type { Permission, User } from '../Auth';

import type { RouterState, ParentRouteProps, RouteOption, WhiteRoute } from './types';

const getAsyncImports = (imports: Record<string, () => Promise<any>>, reg: RegExp) => {
    return Object.keys(imports)
        .map((key) => {
            const names = reg.exec(key);
            return Array.isArray(names) && names.length >= 2
                ? { [names[1]]: imports[key] }
                : undefined;
        })
        .filter((m) => !!m)
        .reduce((o, n) => ({ ...o, ...n }), []) as unknown as Record<string, () => Promise<any>>;
};
export const pages = getAsyncImports(
    import.meta.glob('../../**/*.{tsx,jsx}'),
    /..\/..\/([\w+.?/?]+).tsx|.jsx/i,
);
export const Loading: FC = () => (
    <div className="fixed w-full h-full top-0 left-0 dark:bg-white bg-gray-800 bg-opacity-25 flex items-center justify-center">
        <span>加载中</span>
    </div>
);

/**
 * @description 格式化路由路径
 * @param {RouteOption} item
 * @param {string} basePath
 * @param {string} [parentPath]
 * @returns {*}  {string}
 */
export const formatPath = (item: RouteOption, basePath: string, parentPath?: string): string => {
    const currentPath = 'path' in item && typeof item.path === 'string' ? item.path : '';
    // 如果没有传入父路径则使用basePath作为路由前缀
    let prefix = !parentPath ? basePath : `/${trim(parentPath, '/')}`;
    // 如果是父路径下的根路径则直接父路径
    if (trim(currentPath, '/') === '') return prefix;
    // 如果是顶级根路径并且当前路径以通配符"*"开头则直接返回当前路径
    if (prefix === '/' && currentPath.startsWith('*')) return currentPath;
    // 如果前缀不是"/",则为在前缀后添加"/"作为与当前路径的连接符
    if (prefix !== '/') prefix = `${prefix}/`;
    // 生成最终路径
    return `${prefix}${trim(currentPath, '/')}`;
};

export const getAsyncPage = (props: {
    cacheKey: string;
    loading?: JSX.Element | boolean;
    page: string;
}) => {
    const { cacheKey, loading, page } = props;
    let fallback: JSX.Element | undefined;
    if (loading) {
        fallback = typeof loading === 'boolean' ? <Loading /> : loading;
    }
    return loadable(pages[page], {
        cacheKey: () => cacheKey,
        fallback,
    });
};
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
): RouteOption<Record<string, any>>[] => {
    const roleColumn = authConfig.role_column;
    const permColumn = authConfig.permission_column;
    const loginPath = authConfig.login_path;
    const whiteList = authConfig.white_list;
    let userRoles: Array<Permission<Record<string, any>>> = [];
    let userPerms: Array<Permission<Record<string, any>>> = [];
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
export const factoryRoutes = (children: RouteOption[], parent: ParentRouteProps) => {
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
                const rst = factoryRoutes(item.children, current);
                nameMaps = { ...nameMaps, ...rst.nameMaps };
                if (isRoute) route.children = rst.routes;
                else return rst.routes;
            }
            return [route];
        })
        .reduce((o, n) => [...o, ...n], []) as RouteObject[];
    return { routes, nameMaps };
};
