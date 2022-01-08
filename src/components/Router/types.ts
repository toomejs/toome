import type { MenuDataItem } from '@ant-design/pro-layout';
import type { ReactElement, ReactNode } from 'react';
import type { BrowserRouterProps, NavigateProps, RouteObject } from 'react-router-dom';

import type { SetupedState } from '@/utils';

export type WhiteRoute = string | { name: string } | { path: string };

export type BaseRouteMenuMeta<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        text?: string;
        icon?: React.ReactNode;
        devide?: boolean;
        hide?: boolean;
        target?: '_parent' | '_self' | '_top' | '_blank';
    },
    T
>;

export type AntdRouteMenuMeta<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    Pick<
        MenuDataItem,
        'hideChildrenInMenu' | 'locale' | 'key' | 'disabled' | 'parentKeys' | 'flatMenu'
    >,
    T
>;
interface BaseRouteProps<T extends RecordAnyOrNever = RecordNever> {
    cacheKey?: string;
    access?:
        | boolean
        | {
              roles?: string[];
              permissions?: string[];
          };
    meta?: BaseRouteMenuMeta<T>;
}
interface PathRouteProps<T extends RecordAnyOrNever = RecordNever> extends BaseRouteProps<T> {
    name?: string;
    caseSensitive?: boolean;
    path: string;
    page?: React.ReactNode | string;
    layout?: boolean;
    loading?: JSX.Element | false;
}
interface IndexRouteProps<T extends RecordAnyOrNever = RecordNever> extends BaseRouteProps<T> {
    name?: string;
    index: true;
    page?: React.ReactNode | string;
    layout?: boolean;
    loading?: JSX.Element | false;
}
interface NavigateRouteProps<T extends RecordAnyOrNever = RecordNever>
    extends BaseRouteProps<T>,
        NavigateProps {
    name?: string;
    path?: string;
    index?: boolean;
}

interface MenuRouterProps<T extends RecordAnyOrNever = RecordNever> extends BaseRouteProps<T> {
    name: string;
    path?: string;
}

export type RouteOption<T extends RecordAnyOrNever = RecordNever> = (
    | PathRouteProps<T>
    | IndexRouteProps<T>
    | NavigateRouteProps<T>
    | MenuRouterProps<T>
) & {
    children?: RouteOption<T>[];
};
export interface RouterConfig<T extends RecordAnyOrNever = RecordNever> {
    basePath?: string;
    hash?: boolean;
    window?: Window;
    loading?: JSX.Element | false;
    render?: (basename: string, route: RouteOption<T>, element: ReactElement) => ReactNode;
    server?: string | null;
    auth?: {
        enabled?: boolean;
        redirect?: 'login' | 'custom';
        login_path?: string;
        white_list?: WhiteRoute[];
        role_column?: string;
        permission_column?: string;
    };
    routes: {
        constants: RouteOption<T>[];
        dynamic: RouteOption<T>[];
    };
}
export interface RouterState<T extends RecordAnyOrNever = RecordNever>
    extends Omit<BrowserRouterProps, 'children' | 'basename'>,
        ReRequired<Omit<RouterConfig<T>, 'routes' | 'render' | 'window'>>,
        Pick<RouterConfig<T>, 'routes' | 'render'> {}

export interface ParentRouteProps<T extends RecordAnyOrNever = RecordNever> {
    basePath: string;
    render?: (basename: string, route: RouteOption<T>, element: ReactElement) => ReactNode;
    index?: string;
    path?: string;
    loading?: JSX.Element | false;
}
export type RouterStatusType = SetupedState<{
    next: boolean;
    ready: boolean;
    success: boolean;
}>;
/**
 *
 */
export type RouterStoreType<T extends RecordAnyOrNever = RecordNever> = {
    routes: RouteOption[];
    renders: RouteObject[];
    names: Record<string, string>;
    config: RouterState<T>;
};
