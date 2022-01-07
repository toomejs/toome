import { useCallback } from 'react';

import { useUnmount } from 'react-use';

import { createHookSelectors, deepMerge, useStoreSetuped } from '@/utils';

import { AuthStore } from '../Auth';

import { useFetcherGetter } from '../Fetcher';

import { RouterStore } from '../Router/store';

import type { MenuConfig, MenuOption, MenuStatusType } from './types';
import { changeMenus, getAntdMenus } from './utils';
import { MenuStatus, MenuStore } from './store';

export const useMenu = createHookSelectors(MenuStore);
export const useMenus = () => MenuStore(useCallback((state) => state.data, []));
export const useAntdMenus = () => MenuStore(useCallback((state) => getAntdMenus(state.data), []));

export const useSetupMenu = <T extends RecordAnyOrNever = RecordNever, M = MenuOption<T>>(
    config?: MenuConfig<M>,
) => {
    const fecher = useFetcherGetter();
    const unMenuSub = MenuStatus.subscribe(
        (state) => state.next,
        (next) => changeMenus(next, fecher()),
    );
    const unAuthSub = AuthStore.subscribe(
        (state) => state.user,
        () => {
            const { setuped } = MenuStatus.getState();
            const { type } = MenuStore.getState().config;
            if (setuped && type !== 'router') {
                MenuStatus.setState((state) => {
                    state.next = true;
                });
            }
        },
    );
    const unRouterSub = RouterStore.subscribe(
        (state) => state.routes,
        () => {
            const { setuped } = MenuStatus.getState();
            const { type } = MenuStore.getState().config;
            if (setuped && type === 'router') {
                MenuStatus.setState((state) => {
                    state.next = true;
                });
            }
        },
    );
    useUnmount(() => {
        unRouterSub();
        unAuthSub();
        unMenuSub();
    });
    useStoreSetuped<MenuStatusType>({
        store: MenuStatus,
        callback: () => {
            MenuStore.setState((state) => {
                state.config = deepMerge(state.config, config ?? {});
            });
        },
    });
};
