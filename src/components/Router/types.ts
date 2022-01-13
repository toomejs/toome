/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2022-01-13 22:49:46 +0800
 * @Path           : /src/components/Router/types.ts
 * @Description    : 路由组件类型
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { ComponentType, FunctionComponent, ReactElement, ReactNode } from 'react';
import { BrowserRouterProps, NavigateProps, RouteObject } from 'react-router-dom';

import { SetupedState } from '@/utils';

import { IconComponent, IconName } from '../Icon';

/** ********************************* 全局 ********************************* */
/**
 * 路由配置
 */
export interface RouterConfig<T extends RecordAnyOrNever = RecordNever> {
    /** 跟路径,默认为 '/' */
    basePath?: string;
    /** 是否启用hash模式 */
    hash?: boolean;
    /** window对象 */
    window?: Window;
    /** 加载中组件Loading */
    loading?: FunctionComponent | false;
    /** 通过服务器获取路由配置的API地址,如果不设置则本地配置 */
    server?: string | null;
    /** 自定义页面包装器 */
    render?: (basename: string, route: RouteOption<T>, element: ReactElement) => ReactNode;
    /** 权限保护 */
    auth?: {
        /** 是否根据账户来生成路由 */
        enabled?: boolean;
        /** 未登录时的跳转地址,如未配置则不跳转 */
        login_redirect?: string;
        /** 验证白名单,未登录用户亦可访问 */
        white_list?: WhiteRoute[];
        /** 角色字段,如未配置则启用角色检测功能 */
        role_column?: string;
        /** 权限字段,如配置则启用权限检测功能 */
        permission_column?: string;
    };
    /** 路由列表配置 */
    routes: {
        /** 静态路由列表 */
        constants: RouteOption<T>[];
        /** 动态路由列表 */
        dynamic: RouteOption<T>[];
    };
}

/**
 * 路由生成状态信息
 */
export type RouterStatusType = SetupedState<{
    /** 需要生成新的路由配置 */
    next: boolean;
    /** 新的路由配置已生成完毕,等待生成路由渲染列表 */
    // ready: boolean;
    /** 路由渲染列表生成完毕,提供给react router重置路由 */
    success: boolean;
}>;
/**
 * 路由状态池
 */
export type RouterStoreType<T extends RecordAnyOrNever = RecordNever> = {
    /** 路由配置列表 */
    routes: RouteOption[];
    /** 路由项目列表 */
    items: RouteItem[];
    /** 生成的路由渲染列表,用于提供给react router生成路由 */
    renders: RouteObject[];
    /** 扁平化路由(不包含页面值),用于渲染面包屑等 */
    flats: FlatRouteItem[];
    /** 路由名称映射,用于通过名称导航路由 */
    maps: Record<string, string>;
    /** 路由配置状态(默认状态合并传入的配置) */
    config: RouterState<T>;
};

/**
 * 路由配置状态
 */
export interface RouterState<T extends RecordAnyOrNever = RecordNever>
    extends Omit<BrowserRouterProps, 'children' | 'basename'>,
        ReRequired<Omit<RouterConfig<T>, 'routes' | 'render' | 'window'>>,
        Pick<RouterConfig<T>, 'routes' | 'render'> {}

/**
 * 白名单路由类型
 */
export type WhiteRoute = string | { name: string } | { path: string };

/** ********************************* 项目 ********************************* */
/**
 * 路由选项
 */
export type RouteOption<T extends RecordAnyOrNever = RecordNever> = (
    | PathRouteOption<T>
    | IndexRouteOption<T>
    | NavigateRouteOption<T>
    | MetaRouterProps<T>
) & {
    /** 子路由列表 */
    children?: RouteOption<T>[];
};

/**
 * 路由元数据数据类型(在使用路由方式生成菜单,面包屑,标题等时配置)
 */
export type RouteMeta<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        /** 显示名称,不配置则为路由名称/路径 */
        text?: string;
        /** 显示图标 */
        icon?: IconComponent | IconName;
        /** 是否为纯分隔符 */
        devide?: boolean;
        /** 是否在菜单中隐藏 */
        hide?: boolean;
        /** <a>标签上的target,用于菜单打开外链 */
        target?: '_parent' | '_self' | '_top' | '_blank';
    },
    T
>;
/**
 * 基础路由配置选项
 */
interface BaseRouteOption<T extends RecordAnyOrNever = RecordNever> {
    /** 缓存key值 */
    cacheKey?: string;
    /**
     * 访问权限,默认为true
     * 设置为false则自动加入可访问名单,与加入白名单作用相同
     * 设置为true则只要登录的用户都可以访问
     * 如果设置roles等,则拥有具体权限的登录用户才可以访问
     */
    access?:
        | boolean
        | {
              roles?: string[];
              permissions?: string[];
          };
    /** 路由元数据 */
    meta?: RouteMeta<T>;
}

/**
 * 路径路由选项
 */
interface PathRouteOption<T extends RecordAnyOrNever = RecordNever> extends BaseRouteOption<T> {
    /** 路由名称 */
    name?: string;
    /** 对URL是否区分大小写 */
    caseSensitive?: boolean;
    /** 路由路径 */
    path: string;
    /** 路由页面,可以是组件或组件路径字符串 */
    page?: ComponentType<RouteComponentProps> | string;
    /** 是否为布局页面 */
    // layout?: boolean;
    /** 独立配置loadding,如果不设置则使用总配置的loading */
    loading?: FunctionComponent | false;
}

/**
 * 索引路由选项
 */
interface IndexRouteOption<T extends RecordAnyOrNever = RecordNever> extends BaseRouteOption<T> {
    /** 路由名称 */
    name?: string;
    /** index必须为true */
    index: true;
    /** 路由页面,可以是组件或组件路径字符串 */
    page?: ComponentType<RouteComponentProps> | string;
    /** 是否为布局页面 */
    // layout?: boolean;
    /** 独立配置loadding,如果不设置则使用总配置的loading */
    loading?: FunctionComponent | false;
}
/** 跳转路由选项 */
type NavigateRouteOption<T extends RecordAnyOrNever = RecordNever> = BaseRouteOption<T> &
    NavigateProps & {
        /** 路由名称 */
        name?: string;
    } & (
        | {
              /** 路由路径 */
              path: string;
          }
        | {
              /** 索引路由 */
              index: true;
          }
    );

/**
 * 非路由选项(只用作菜单等)
 */
interface MetaRouterProps<T extends RecordAnyOrNever = RecordNever> extends BaseRouteOption<T> {
    /** 路由名称 */
    name: string;
    /** 路由路径 */
    path?: string;
}
/**
 * 递归路由选项时传入的父级路由参数
 */
export interface ParentRouteProps<T extends RecordAnyOrNever = RecordNever> {
    /** 基础路径 */
    basePath: string;
    /** 自定义渲染包装器 */
    render?: (basename: string, route: RouteOption<T>, element: ReactElement) => ReactNode;
    /** 父路由序号连接符,用于生成ID */
    index?: string;
    /** 父路由路径 */
    path?: string;
}

/** ********************************* 数据 ********************************* */
/**
 * 处理后的准确配置
 */
export type RouteItem<T extends RecordAnyOrNever = RecordNever> = {
    id: string;
    name?: string;
    loading: FunctionComponent | false;
    caseSensitive?: boolean;
    meta?: RouteMeta<T>;
    children?: RouteItem<T>[];
} & (PathRouteItem | MetaRouteItem);
/**
 * 扁平化路由项
 */
export type FlatRouteItem<T extends RecordAnyOrNever = RecordNever> = Pick<
    RouteItem<T>,
    'id' | 'name' | 'meta' | 'isRoute'
> & {
    path: string;
};

/**
 * 正常路由项
 */
interface PathRouteItem {
    isRoute: true;
    component: ComponentType<RouteComponentProps>;
    path: { base: string; absolute: string; relative?: string; index?: boolean };
}

/**
 * 非路由项(只用于生成菜单等)
 */
interface MetaRouteItem {
    isRoute: false;
    path: { base: string; absolute: string };
}

/**
 * 传给页面的参数
 */
export type RouteComponentProps<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    Omit<RouteItem & PathRouteItem, 'component'>,
    T
>;

// export type AntdRouteMenuMeta<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
//     Pick<
//         MenuDataItem,
//         'hideChildrenInMenu' | 'locale' | 'key' | 'disabled' | 'parentKeys' | 'flatMenu'
//     >,
//     T
// >;
