import { isArray, omit } from 'lodash-es';

import type { AxiosInstance } from 'axios';

import { isUrl } from '@/utils';

import type { BaseRouteMenuMeta, ParentRouteProps, RouteOption } from '../Router/types';
import { formatPath } from '../Router/utils';

import { RouterStore } from '../Router';

import { AuthStore } from '../Auth';

import type { AntdMenuOption, MenuOption } from './types';
import { MenuStore, MenuStatus } from './store';

export const changeMenus = async (next: boolean, fetcher: AxiosInstance) => {
    if (next) {
        const { config } = MenuStore.getState();
        const { user } = AuthStore.getState();
        const {
            routes,
            config: { basePath },
        } = RouterStore.getState();
        if (config.type === 'router') {
            MenuStore.setState((state) => {
                state.data = getRouteMenus(routes, { basePath });
            });
        } else if (config.type === 'server' && config.server && user) {
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
            MenuStore.setState((state) => {
                state.data = [];
            });
        }
        MenuStatus.setState((state) => {
            state.next = false;
        });
    }
};
export const getRouteMenus = (routes: RouteOption[], parent: ParentRouteProps): MenuOption[] =>
    routes
        .map((route, index) => {
            const current: ParentRouteProps = {
                ...parent,
                basePath: parent.basePath,
                index: parent.index ? `${parent.index}.${index.toString()}` : index.toString(),
            };
            const isRoute =
                ('path' in route && route.path && !isUrl('path')) ||
                'index' in route ||
                'to' in route;
            if (isRoute) {
                current.path = formatPath(route, parent.basePath, parent.path);
            }
            let children: MenuOption[] = [];
            if (route.children) {
                children = getRouteMenus(route.children, current);
            }
            if (route.name) {
                const meta = (route.meta ?? {}) as BaseRouteMenuMeta;
                const menu: MenuOption = {
                    ...meta,
                    id: current.index!,
                    text: meta.text ?? route.name,
                };
                if (current.path) {
                    menu.path = current.path;
                }
                if (children.length) {
                    menu.children = children;
                }
                return [menu];
            }
            return children;
        })
        .reduce((o, n) => [...o, ...n], [])
        .filter((m) => !!m) as MenuOption[];

export const getAntdMenus = <T extends RecordAnyOrNever>(
    menus: MenuOption<T>[],
): AntdMenuOption<T>[] =>
    menus.map((item) => {
        const menu: Record<string, any> = omit(item, [
            'id',
            'text',
            'target',
            'hide',
            'children',
            'routes',
        ]);
        menu.id = item.id;
        menu.name = item.text;
        if (item.path) {
            menu.path = item.path;
            if (isUrl(menu.path)) {
                menu.target = item.target;
            }
        }
        if (item.hide) menu.hideInMenu = true;
        if (item.children) menu.children = getAntdMenus(item.children);
        return menu as AntdMenuOption<T>;
    });
