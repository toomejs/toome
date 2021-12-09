import type { MenuDataItem } from '@ant-design/pro-layout';
import type { ReactElement, ReactNode } from 'react';
import type { BrowserRouterProps, NavigateProps } from 'react-router-dom';

export type WhiteRoute = string | { name: string } | { path: string };

export type BaseRouteMenuMeta<T extends Record<string, any> = Record<string, any>> = {
    text?: string;
    icon?: React.ReactNode;
    devide?: boolean;
    hide?: boolean;
    target?: '_parent' | '_self' | '_top' | '_blank';
} & T;

export type AntdRouteMenuMeta<T extends Record<string, any> = Record<string, any>> = Pick<
    MenuDataItem,
    'hideChildrenInMenu' | 'locale' | 'key' | 'disabled' | 'parentKeys' | 'flatMenu'
> &
    T;
interface BaseRouteProps<T extends Record<string, any>> {
    cacheKey?: string;
    access?:
        | boolean
        | {
              roles?: string[];
              permissions?: string[];
          };
    meta?: BaseRouteMenuMeta<T>;
}
interface PathRouteProps<T extends Record<string, any>> extends BaseRouteProps<T> {
    name?: string;
    caseSensitive?: boolean;
    path: string;
    page?: React.ReactNode | string;
    loading?: JSX.Element | false;
}
interface IndexRouteProps<T extends Record<string, any>> extends BaseRouteProps<T> {
    name?: string;
    index: true;
    page?: React.ReactNode | string;
    loading?: JSX.Element | false;
}
interface NavigateRouteProps<T extends Record<string, any>>
    extends BaseRouteProps<T>,
        NavigateProps {
    name?: string;
    path?: string;
    index?: boolean;
}

interface MenuRouterProps<T extends Record<string, any>> extends BaseRouteProps<T> {
    name: string;
    path?: string;
}

export type RouteOption<T extends Record<string, any> = Record<string, any>> = (
    | PathRouteProps<T>
    | IndexRouteProps<T>
    | NavigateRouteProps<T>
    | MenuRouterProps<T>
) & {
    children?: RouteOption<T>[];
};
export interface RouterConfig<T extends Record<string, any> = Record<string, any>> {
    basePath?: string;
    hash?: boolean;
    window?: Window;
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
export interface RouterState<T extends Record<string, any> = Record<string, any>>
    extends Omit<BrowserRouterProps, 'children' | 'basename'>,
        ReReuired<Omit<RouterConfig<T>, 'routes' | 'render' | 'window'>>,
        Pick<RouterConfig<T>, 'routes' | 'render'> {}

export interface ParentRouteProps<T extends Record<string, any> = Record<string, any>> {
    basePath: string;
    render?: (basename: string, route: RouteOption<T>, element: ReactElement) => ReactNode;
    index?: string;
    path?: string;
}
