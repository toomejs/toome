import type { MenuDataItem } from '@ant-design/pro-layout/lib/typings';
import type { ReactElement, ReactNode } from 'react';
import type { BrowserRouterProps, NavigateProps } from 'react-router-dom';

/**
 * @description 公共路由项设置
 * @interface BaseRouteProps
 * @template M
 */
interface BaseRouteProps<
    M extends Record<string, any> | null,
    B = { icon?: React.ReactNode; text?: string },
    T = M extends null ? B & { hideMenu?: boolean } : B & M,
> {
    name?: string;
    cacheKey?: string;
    auth?: boolean;
    /**
     * @description 传给页面的额外参数,主要用于菜单
     * @type {({ hideMenu?: boolean } & P)}
     */
    meta?: T;
    /**
     * @description 显示加载中的组件
     * @type {JSX.Element}
     */
    loading?: JSX.Element | false;
}

/**
 * @description 分隔符菜单路由
 * @interface DivideRouteProps
 * @extends {(Omit<BaseRouteProps<M>, 'cacheKey' | 'loading'>)}
 * @template M
 */
interface DivideRouteProps<M extends Record<string, any> | null>
    extends Omit<BaseRouteProps<M>, 'cacheKey' | 'loading'> {
    isDivide: true;
}
/**
 * @description URL外链菜单路由
 * @interface URLRouteProps
 * @extends {(Omit<BaseRouteProps<M>, 'cacheKey' | 'loading'>)}
 * @template M
 */
interface URLRouteProps<M extends Record<string, any> | null>
    extends Omit<BaseRouteProps<M>, 'cacheKey' | 'loading'> {
    isUrl: true;
    path: string;
    target?: '_parent' | '_self' | '_top' | '_blank';
}
/**
 * @description 普通路径路由
 * @interface PathRouteProps
 * @extends {BaseRouteProps<M>}
 * @template M
 */
interface PathRouteProps<M extends Record<string, any> | null> extends BaseRouteProps<M> {
    caseSensitive?: boolean;
    path: string;
    page?: React.ReactNode | string;
    isDivide?: never;
    isUrl?: never;
}
/**
 * @description 索引路由
 * @interface IndexRouteProps
 * @extends {BaseRouteProps<M>}
 * @template M
 */
interface IndexRouteProps<M extends Record<string, any> | null> extends BaseRouteProps<M> {
    index: true;
    page?: React.ReactNode | string;
    isDivide?: never;
    isUrl?: never;
}
/**
 * @description 跳转路由
 * @interface NavigateRouteProps
 * @extends {BaseRouteProps<M>}
 * @extends {NavigateProps}
 * @template M
 */
interface NavigateRouteProps<M extends Record<string, any> | null>
    extends BaseRouteProps<M>,
        NavigateProps {
    path?: string;
    index?: boolean;
    isDivide?: never;
    isUrl?: never;
}
/**
 * 路由项配置
 */
export type RouteOption<M extends Record<string, any> | null = null> = (
    | URLRouteProps<M>
    | PathRouteProps<M>
    | IndexRouteProps<M>
    | NavigateRouteProps<M>
    | DivideRouteProps<M>
) & {
    children?: RouteOption<M>[];
};
/**
 * @description 路由配置
 * @export
 * @interface RouterConfig
 * @extends {Omit<BrowserRouterProps, 'children'>}
 * @template M
 */
export interface RouterConfig<M extends Record<string, any> | null = null>
    extends Omit<BrowserRouterProps, 'children'> {
    render?: (basename: string, route: RouteOption, element: ReactElement) => ReactNode;
    hash?: boolean;
    routes?: RouteOption<M>[];
}

export type MenuOption<T extends Record<string, any> = Record<string, any>> = T & {
    id: string;
    text: string;
    divide?: boolean;
    path?: string;
    url?: string;
    icon?: ReactNode;
    target?: '_parent' | '_self' | '_top' | '_blank';
    children?: MenuOption<T>[];
};

/**
 * @description Antd路由菜单meta数据
 * @export
 * @interface AntdRouteMeta
 * @extends {(Pick<MenuDataItem, 'hideChildrenInMenu'
 *         | 'hideInMenu'
 *         | 'locale'
 *         | 'key'
 *         | 'disabled'
 *         | 'parentKeys'
 *         | 'flatMenu'>)}
 */
export interface AntdRouteMeta
    extends Pick<
        MenuDataItem,
        | 'hideChildrenInMenu'
        | 'hideInMenu'
        | 'locale'
        | 'key'
        | 'disabled'
        | 'parentKeys'
        | 'flatMenu'
    > {
    text?: string;
}
export interface AntdMenuOption extends MenuOption<Omit<AntdRouteMeta, 'text'>> {}
/**
 * Antd菜单路由
 */
export type AntdRouteOption<M extends Record<string, any> = Record<string, any>> = RouteOption<
    AntdRouteMeta & M
>;

/**
 * @description Antd路由配置
 * @export
 * @interface AntdRouterConfig
 * @extends {(RouterConfig<AntdRouteMeta & M>)}
 * @template M
 */
export interface AntdRouterConfig<M extends Record<string, any> = Record<string, any>>
    extends RouterConfig<AntdRouteMeta & M> {}

export interface ParentPropsForGenerator {
    basePath: string;
    render?: (basename: string, route: RouteOption, element: ReactElement) => ReactNode;
    index?: string;
    path?: string;
    name?: string;
}

export interface AsyncProps {
    cacheKey: string;
    loading?: JSX.Element | boolean;
    page: string;
}
