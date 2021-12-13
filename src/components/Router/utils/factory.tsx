import { omit, pick } from 'lodash-es';
import type { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { isUrl } from '@/utils/tools';

import { getAsyncPage } from '../lazyload';
import type { ParentRouteProps, RouteOption } from '../types';

import { formatPath } from './filter';

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
