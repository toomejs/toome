import type { SetupedState } from '@/utils';

import type { AntdRouteMenuMeta, BaseRouteMenuMeta } from '../Router';

export interface MenuConfig<T extends RecordAnyOrNever = RecordNever> {
    type?: 'server' | 'router' | 'configure';
    server?: string | null;
    menus?: MenuOption<T>[];
}

export interface MenuState<T extends RecordAnyOrNever = RecordNever>
    extends Omit<ReRequired<MenuConfig<T>>, 'menus'> {
    menus: MenuOption<T>[];
}

export type MenuOption<T extends RecordAnyOrNever = RecordNever> = BaseRouteMenuMeta<T> & {
    id: string;
    text: string;
    path?: string;
    children?: MenuOption<T>[];
};

export type AntdMenuOption<T extends RecordAnyOrNever = RecordNever> = MenuOption<
    AntdRouteMenuMeta<T>
>;
export type MenuStatusType = SetupedState<{
    next: boolean;
}>;
export interface MenuStoreType<T extends RecordAnyOrNever = RecordNever> {
    config: MenuState<T>;
    data: MenuOption<T>[];
}
