import { isNil, omit, pick } from 'lodash-es';

import { Navigate, Outlet } from 'react-router-dom';

import { is } from 'ramda';

import { isUrl } from '@/utils';

import { getUser } from '@/components/Auth';

import {
    CustomRender,
    FlatRouteItem,
    ParentRouteProps,
    RouteItem,
    RouteObjectWithId,
    RouteOption,
    RoutePage,
} from '../../types';
import { checkRoute, mergeRoutePath } from '../helpers';
import { AuthRedirect, getAsyncPage, IFramePage } from '../views';
import { RouterStatus, RouterStore } from '../../store';

interface PageCreateProps {
    item: RouteOption;
    cacheKey: string;
    loading: false | FC;
    render?: CustomRender;
}
export const factoryItems = () => {
    const { config, routes } = RouterStore.getState();
    const items = generateItems(
        routes,
        {
            basePath: config.basePath,
            render: config.render,
        },
        config.loading,
    );
    RouterStore.setState((state) => {
        state.items = items;
    });
};
export const factoryRenders = (items: RouteItem[], render?: CustomRender<RecordAny>) => {
    const renders = generateRenders(items, render);
    const flats = generateFlats(items);
    const maps = generateMaps(flats);
    RouterStore.setState((state) => {
        state.renders = renders;
        state.flats = flats;
        state.maps = maps;
    });
};
/**
 * 生成路由渲染列表
 */
export const factoryFinalRoutes = (renders: RouteObjectWithId[]) => {
    RouterStatus.setState((state) => ({ ...state, success: false }));
    const user = getUser();
    const { config } = RouterStore.getState();
    RouterStore.setState((state) => {
        state.renders = renders;
        if (config.auth.enabled && !user && config.auth.login_redirect) {
            state.renders.push({
                id: 'auth-redirect',
                path: '*',
                element: <AuthRedirect loginPath={config.auth.login_redirect} />,
            });
        }
    });
    RouterStatus.setState((state) => ({ ...state, success: true }));
};

/**
 * 构建路由渲染列表
 * @param routes
 */
export const generateRenders = (routes: RouteItem[], render?: CustomRender<RecordAny>) => {
    return routes
        .map((item) => {
            const children: RouteObjectWithId[] = item.children
                ? generateRenders(item.children)
                : [];
            if (!item.isRoute) return children;
            const route: RouteObjectWithId = { id: item.id, caseSensitive: item.caseSensitive };
            if (item.path.relative) route.path = item.path.relative;
            else route.index = item.path.index;
            if (render) {
                route.element = () =>
                    render({ route: { ...omit(item, 'component') } }, item.component);
            } else {
                route.element = <item.component route={{ ...omit(item, 'component') }} />;
            }
            route.children = children;
            return [route];
        })
        .reduce((o, n) => [...o, ...n], []);
};
const generateItems = (options: RouteOption[], parent: ParentRouteProps, loading: FC | false) => {
    return options.map((item, index) => {
        const current: ParentRouteProps & { index: string } = {
            ...parent,
            index: parent.index ? `${parent.index}.${index.toString()}` : index.toString(),
        };
        const isRoute = checkRoute(item);
        if (isRoute) {
            current.path = mergeRoutePath(item, parent.basePath, parent.path);
        }
        const route = {
            id: current.index,
            name: item.name,
            meta: item.meta,
            loading: false,
            isRoute,
            isPage: 'page' in item && item.page,
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
            route.component = getRoutePage({
                item,
                cacheKey: item.cacheKey ?? item.name ?? current.index,
                loading: (item as any).loading ?? loading,
                render: 'render' in item ? item.render : parent.render,
            });
        }
        return route;
    });
};

const generateFlats = (routes: RouteItem[]): FlatRouteItem[] => {
    return routes
        .map((item) => {
            const data = pick(item, ['id', 'name', 'meta', 'isRoute', 'path']) as FlatRouteItem;
            if (item.isRoute) {
                data.index = item.path.index;
                data.isPage = item.isPage;
            }
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
            .map((item) => [item.name, item.id]),
    );
};
const getRoutePage = ({ item, cacheKey, loading, render }: PageCreateProps): RoutePage => {
    const isRedirectRoute = 'to' in item;
    if (isRedirectRoute) {
        // 当前项是一个跳转路由
        if (typeof item.to === 'string' && isUrl(item.to)) {
            // 跳转到外链的时候使用Iframe包装
            return ({ route, ...rest }) => (
                <IFramePage to={item.to as string} route={route} {...rest} />
            );
        }
        return () => <Navigate {...pick(item, ['to', 'state'])} replace />;
    }
    if ('page' in item && item.page) {
        // 当前页面是一个页面路由
        if (is(String, item.page)) {
            // 异步页面
            const AsyncPage = getAsyncPage({
                page: item.page as string,
                cacheKey,
                loading,
            });
            if (render) return (props) => render(props, AsyncPage);
            return ({ route, ...rest }) => <AsyncPage route={route} {...rest} />;
        }
        // 正常页面
        const Page = item.page;
        if (render) return (props) => render(props, Page);
        return ({ route, ...rest }) => <Page route={route} {...rest} />;
    }
    return () => <Outlet />;
};
