import { useAsyncEffect, useDeepCompareEffect } from 'ahooks';

import { isArray } from 'lodash-es';

import { useCallback } from 'react';

import create from 'zustand';
import shallow from 'zustand/shallow';

import { useStoreSetuped, createHookSelectors, createImmer, deepMerge } from '@/utils';

import { useUser } from '../Auth';

import { useFetcher } from '../Request';

import { useRouterStore } from '../Router';

import { getDefaultMenuStore } from './_default.config';
import type { MenuConfig, MenuStore, MenuOption } from './types';
import { getAntdMenus, getRouteMenus } from './utils';

const Setuped = create(() => ({}));
export const useMenuStore = createImmer<MenuStore>(() => getDefaultMenuStore());
export const useMenu = createHookSelectors(useMenuStore);
export const useAntdMenus = () =>
    useMenuStore(useCallback((state) => getAntdMenus(state.data), []));

export const useSetupMenu = <T extends RecordAnyOrNever = RecordNever, M = MenuOption<T>>(
    config?: MenuConfig<M>,
) => {
    const user = useUser();
    const fecher = useFetcher();
    const { routes, basePath } = useRouterStore(
        (state) => ({
            routes: state.routes,
            basePath: state.config.basePath,
        }),
        shallow,
    );

    const { configed, shouldChange } = useMenuStore(
        (state) => ({ configed: state.config, shouldChange: state.shouldChange }),
        shallow,
    );
    useStoreSetuped({
        store: Setuped,
        callback: () => {
            if (config) {
                useMenuStore.setState((state) => {
                    state.config = deepMerge(state.config, config ?? {});
                });
            }
        },
    });
    useDeepCompareEffect(() => {
        if (configed.type !== 'router')
            useMenuStore.setState((state) => {
                state.shouldChange = true;
            });
    }, [user]);
    useDeepCompareEffect(() => {
        if (configed.type === 'router')
            useMenuStore.setState((state) => {
                state.shouldChange = true;
            });
    }, [routes]);
    useAsyncEffect(async () => {
        if (shouldChange) {
            if (configed.type === 'router') {
                useMenuStore.setState((state) => {
                    state.data = getRouteMenus(routes, { basePath });
                });
            } else if (configed.type === 'server' && configed.server && user) {
                try {
                    const { data } = await fecher().get<MenuOption<T>[]>(configed.server);
                    if (isArray(data)) {
                        useMenuStore.setState((state) => {
                            state.data = data;
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                useMenuStore.setState((state) => {
                    state.data = [];
                });
            }
            useMenuStore.setState((state) => {
                state.shouldChange = false;
            });
        }
    }, [shouldChange]);
};
