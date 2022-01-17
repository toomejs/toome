/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-14 00:07:50 +0800
 * Updated_at     : 2022-01-13 17:08:57 +0800
 * Path           : /src/components/Menu/utils.tsx
 * Description    : 菜单工具函数
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { isArray } from 'lodash-es';

import { AxiosInstance } from 'axios';

import { isUrl } from '@/utils';

import { RouteMeta, ParentRouteProps, RouteOption } from '../Router/types';
import { checkRoute, mergeRoutePath } from '../Router/utils';

import { RouterStore } from '../Router';

import { AuthStore } from '../Auth';

import { MenuOption } from './types';
import { MenuStore, MenuStatus } from './store';
/**
 * 刷新菜单数据
 * @param next 是否开始刷新
 * @param fetcher 远程数据访问工具
 */
export const changeMenus = async (next: boolean, fetcher: AxiosInstance) => {
    if (next) {
        const { config } = MenuStore.getState();
        const { user } = AuthStore.getState();
        const {
            routes,
            config: { basePath },
        } = RouterStore.getState();
        if (config.type === 'router') {
            // 如果菜单通过路由携带则其权限跟随路由生成
            MenuStore.setState((state) => {
                state.data = getRouteMenus(routes, { basePath });
            });
        } else if (config.type === 'server' && config.server && user) {
            // 如果菜单通过服务端获取请在服务端自行过滤权限
            try {
                const { data } = await fetcher.get<MenuOption[]>(config.server);
                if (isArray(data)) {
                    MenuStore.setState((state) => {
                        state.data = data;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            // 过滤独立配置的菜单
            MenuStore.setState((state) => {
                state.data = [];
            });
        }
        MenuStatus.setState((state) => {
            state.next = false;
        });
    }
};
/**
 * 获取路由携带的菜单
 * @param routes 路由列表
 * @param parent 父级配置
 */
const getRouteMenus = (routes: RouteOption[], parent: ParentRouteProps): MenuOption[] =>
    routes
        .map((route, index) => {
            const current: ParentRouteProps & { index: string } = {
                ...parent,
                basePath: parent.basePath,
                index: parent.index ? `${parent.index}.${index.toString()}` : index.toString(),
            };
            const isRoute = checkRoute(route);
            if (isRoute) current.path = mergeRoutePath(route, parent.basePath, parent.path);
            let children: MenuOption[] = [];
            if (route.children) children = getRouteMenus(route.children, current);
            if (route.name) {
                const meta = (route.meta ?? {}) as RouteMeta;
                const menu: MenuOption = {
                    ...meta,
                    id: current.index!,
                    text: meta.text ?? route.name ?? current.index,
                };
                if ('path' in route && route.path) {
                    menu.path = isUrl(route.path) ? route.path : current.path;
                }
                if (children.length) menu.children = children;
                return [menu];
            }
            return children;
        })
        .reduce((o, n) => [...o, ...n], [])
        .filter((m) => !!m) as MenuOption[];

// export const getAntdMenus = <T extends RecordAnyOrNever>(
//     menus: MenuOption<T>[],
// ): AntdMenuOption<T>[] =>
//     menus.map((item) => {
//         const menu: Record<string, any> = omit(item, [
//             'id',
//             'text',
//             'target',
//             'hide',
//             'children',
//             'routes',
//         ]);
//         menu.id = item.id;
//         menu.name = item.text;
//         if (item.path) {
//             menu.path = item.path;
//             if (isUrl(menu.path)) {
//                 menu.target = item.target;
//             }
//         }
//         if (item.hide) menu.hideInMenu = true;
//         if (item.children) menu.children = getAntdMenus(item.children);
//         return menu as AntdMenuOption<T>;
//     });
