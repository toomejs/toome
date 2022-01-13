/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2022-01-12 21:02:47 +0800
 * @Path           : /src/components/Menu/types.ts
 * @Description    : 菜单组件类型
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { SetupedState } from '@/utils';

import { RouteMeta } from '../Router';

/**
 * 菜单配置
 */
export interface MenuConfig<T extends RecordAnyOrNever = RecordNever> {
    /**
     * 获取菜单的方式
     * server: 通过服务器获取
     * router: 通过路由携带
     * configure: 独立配置
     */
    type?: 'server' | 'router' | 'configure';
    /** 通过服务器获取菜单的API地址 */
    server?: string | null;
    /** 独立配置的菜单列表 */
    menus?: MenuOption<T>[];
}
/**
 * 菜单数据状态
 */
export interface MenuState<T extends RecordAnyOrNever = RecordNever>
    extends Omit<ReRequired<MenuConfig<T>>, 'menus'> {
    /** 菜单列表 */
    menus: MenuOption<T>[];
}
/**
 * 菜单选项(继承自路由菜单元数据)
 */
export type MenuOption<T extends RecordAnyOrNever = RecordNever> = RouteMeta<T> & {
    /** 菜单ID */
    id: string;
    /** 菜单文字 */
    text: string;
    /** 菜单路径 */
    path?: string;
    /** 子菜单 */
    children?: MenuOption<T>[];
};
/**
 * 菜单生成信号状态管理池
 */
export type MenuStatusType = SetupedState<{
    /** 是否即将开始重新生成菜单 */
    next: boolean;
}>;
/**
 * 菜单数据状态管理池
 */
export interface MenuStoreType<T extends RecordAnyOrNever = RecordNever> {
    /** 菜单配置状态 */
    config: MenuState<T>;
    /** 最终菜单数据 */
    data: MenuOption<T>[];
}
// export type AntdMenuOption<T extends RecordAnyOrNever = RecordNever> = MenuOption<
//     AntdRouteMenuMeta<T>
// >;
