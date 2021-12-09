import type { AntdRouteMenuMeta, BaseRouteMenuMeta } from '../Routing';

export interface MenuConfig<T extends Record<string, any> = Record<string, any>> {
    type?: 'server' | 'router' | 'configure';
    server?: string | null;
    menus?: MenuOption<T>[];
}

export interface MenuState<T extends Record<string, any> = Record<string, any>>
    extends Omit<ReReuired<MenuConfig<T>>, 'menus'> {
    menus: MenuOption<T>[];
}

export type MenuOption<T extends Record<string, any> = Record<string, any>> =
    BaseRouteMenuMeta<T> & {
        id: string;
        text: string;
        path?: string;
        children?: MenuOption<T>[];
    };

export type AntdMenuOption<T extends Record<string, any> = Record<string, any>> = MenuOption<
    AntdRouteMenuMeta<T>
>;
