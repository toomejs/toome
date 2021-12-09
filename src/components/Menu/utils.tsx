import { omit } from 'lodash-es';

import { isUrl } from '@/utils/tools';

import type { BaseRouteMenuMeta, ParentRouteProps, RouteOption } from '../Routing';

import { formatPath } from '../Routing/utils';

import type { AntdMenuOption, MenuOption } from './types';

export const getRouteMenus = (routes: RouteOption[], parent: ParentRouteProps): MenuOption[] => {
    return routes
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
};

export const getAntdMenus = <T extends Record<string, any>>(
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
