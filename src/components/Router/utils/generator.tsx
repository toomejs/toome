/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-14 00:07:50 +0800
 * Updated_at     : 2022-01-13 22:56:06 +0800
 * Path           : /src/components/Router/utils/generator.tsx
 * Description    : 路由生成函数
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { omit, pick } from 'lodash-es';
import { FunctionComponent } from 'react';
import { RouteObject, Navigate, Outlet } from 'react-router-dom';

import { isNil } from 'ramda';

import { isUrl } from '@/utils';

import { getUser } from '@/components/Auth';

import {
    FlatRouteItem,
    ParentRouteProps,
    RouteComponentProps,
    RouteItem,
    RouteOption,
} from '../types';

import { RouterStatus, RouterStore } from '../store';

import { formatPath, checkRoute } from './helpers';
import { AuthRedirect, getAsyncPage, IFramePage } from './views';

/**
 * 生成最终路由
 */
export const generateFinalRoutes = () => {
    const user = getUser();
    const { config, routes } = RouterStore.getState();
    const { items, flats, maps, renders } = generateRoutes(
        routes,
        {
            basePath: config.basePath,
            render: config.render,
        },
        config.loading,
    );
    RouterStore.setState((state) => {
        state.items = items;
        state.flats = flats;
        state.maps = maps;
        state.renders = renders;
        // 如果开启权限保护并且没有登录则对于不存在的路由直接跳转到登录页面
        if (state.config.auth.enabled && !user && state.config.auth.login_redirect) {
            state.renders.push({
                path: '*',
                element: <AuthRedirect loginPath={state.config.auth.login_redirect} />,
            });
        }
    });
    RouterStatus.setState((state) => ({ ...state, next: false, ready: false, success: true }));
};
/**
 * 构建路由渲染列表
 * @param routes
 */
export const generateRenders = (routes: RouteItem[]) => {
    return routes
        .map((item) => {
            const children: RouteObject[] = item.children ? generateRenders(item.children) : [];
            if (!item.isRoute) return children;
            const route: RouteObject = { caseSensitive: item.caseSensitive };
            if (item.path.relative) route.path = item.path.relative;
            else route.index = item.path.index;
            route.element = <item.component {...omit(item, 'component')} />;
            route.children = children;
            return [route];
        })
        .reduce((o, n) => [...o, ...n], []);
};
const generateRoutes = (
    options: RouteOption[],
    parent: ParentRouteProps,
    loading: FunctionComponent | false,
) => {
    const items = generateItems(options, parent, loading);
    const flats = generateFlats(items);
    const maps = generateMaps(flats);
    const renders = generateRenders(items);
    return { items, flats, maps, renders };
};
const generateItems = (
    options: RouteOption[],
    parent: ParentRouteProps,
    loading: FunctionComponent | false,
) => {
    return options.map((item, index) => {
        const current: ParentRouteProps & { index: string } = {
            ...parent,
            index: parent.index ? `${parent.index}.${index.toString()}` : index.toString(),
        };
        const isRoute = checkRoute(item);
        if (isRoute) {
            current.path = formatPath(item, parent.basePath, parent.path);
        }
        const route = {
            id: item.name ?? current.index,
            name: item.name,
            meta: item.meta,
            loading: false,
            isRoute,
            caseSensitive: 'caseSensitive' in item && item.caseSensitive,
            path: {
                base: current.basePath,
                absolute: isRoute ? current.path : (item as any).path,
            },
        } as RouteItem;
        const hasChildren = item.children && item.children.length > 0;
        if (hasChildren) {
            route.children = generateItems(item.children!, current, loading);
        }
        if (route.isRoute) {
            if ((item as any).path) route.path = { ...route.path, relative: (item as any).path };
            else route.path = { ...route.path, index: true };
            route.component = getRoutePage(
                item,
                item.cacheKey ?? item.name ?? current.index,
                (item as any).loading ?? loading,
            );
        }
        return route;
    });
};

const generateFlats = (routes: RouteItem[]): FlatRouteItem[] => {
    return routes
        .map((item) => {
            const data = pick(item, ['id', 'name', 'meta', 'isRoute']) as FlatRouteItem;
            data.path = item.path.absolute;
            if (!item.children) return [data];
            return [data, ...generateFlats(item.children)];
        })
        .reduce((o, n) => [...o, ...n], []);
};
const generateMaps = (routes: FlatRouteItem[]): { [key: string]: string } => {
    return Object.fromEntries(
        routes
            .filter(
                (item) => !item.isRoute || isNil(item.path) || isUrl(item.path) || isNil(item.name),
            )
            .map((item) => [item.name, item.path]),
    );
};

const getRoutePage = (item: RouteOption, cacheKey: string, loading: false | FunctionComponent) => {
    const isRedirectRoute = 'to' in item;
    if (isRedirectRoute) {
        // 当前项是一个跳转路由
        if (typeof item.to === 'string' && isUrl(item.to)) {
            // 跳转到外链的时候使用Iframe包装
            return (props: Omit<RouteComponentProps, 'component'>) => (
                <IFramePage to={item.to as string} {...props} />
            );
        }
        return () => <Navigate {...pick(item, ['to', 'state'])} replace />;
    }
    if ('page' in item && item.page) {
        // 当前页面是一个页面路由
        if (typeof item.page === 'string') {
            // 异步页面
            const AsyncPage = getAsyncPage({
                page: item.page as string,
                cacheKey,
                loading,
            });
            return (props: RouteComponentProps) => <AsyncPage route={props} />;
        }
        // 正常页面
        return item.page;
    }
    // 当前页面不是路由的情况下直接放入占位符
    return () => <Outlet />;
};
