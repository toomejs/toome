import { useDeepCompareEffect } from 'ahooks';

import { useCallback } from 'react';

import shallow from 'zustand/shallow';

import { deepMerge, useStoreSetuped } from '@/utils';

import { useUser } from '../Auth';

import { useFetcher } from '../Fetcher';

import { useRouterStore } from '../Router/hooks/store';

import type { MenuConfig, MenuOption } from './types';
import { changeMenus, getAntdMenus } from './utils';
import { MenuSetuped, MenuStore } from './store';

export const useAntdMenus = () => MenuStore(useCallback((state) => getAntdMenus(state.data), []));

export const useSetupMenu = <T extends RecordAnyOrNever = RecordNever, M = MenuOption<T>>(
    config?: MenuConfig<M>,
) => {
    const user = useUser();
    const fecher = useFetcher();
    const { routes } = useRouterStore(
        (state) => ({
            routes: state.routes,
            basePath: state.config.basePath,
        }),
        shallow,
    );

    useStoreSetuped({
        store: MenuSetuped,
        callback: () => {
            MenuStore.setState((state) => {
                state.config = deepMerge(state.config, config ?? {});
            });
            MenuStore.subscribe(
                (state) => state.shouldChange,
                (shouldChange) => {
                    // if (shouldChange) {
                    //     const routesList = useRouterStore.getState().routes;
                    //     MenuStore.setState((data) => {
                    //         data.data = [{ text: routesList.length.toString(), id: 'fff' }];
                    //     });
                    // }
                    changeMenus(shouldChange, fecher);
                },
            );
        },
    });
    useDeepCompareEffect(() => {
        const { setuped } = MenuSetuped.getState();
        const { type } = MenuStore.getState().config;
        if (setuped && type !== 'router') {
            MenuStore.setState((state) => {
                state.shouldChange = true;
            });
        }
    }, [user]);
    useDeepCompareEffect(() => {
        const { setuped } = MenuSetuped.getState();
        const { type } = MenuStore.getState().config;
        if (setuped && type === 'router') {
            MenuStore.setState((state) => {
                state.shouldChange = true;
            });
        }
    }, [routes]);
};
