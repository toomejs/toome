import { useAsyncEffect, useDeepCompareEffect } from 'ahooks';

import { isArray } from 'lodash-es';

import { useState } from 'react';

import shallow from 'zustand/shallow';

import { useDeepCompareMemo } from '@/hooks';
import { createImmer } from '@/utils/store';

import { deepMerge } from '@/utils/tools';

import { useUser } from '../Auth';
import { useRequest } from '../Request';

import { useRouter, useRouterConfig } from '../Routing';

import { getDefaultMenuState } from './_defaultState';
import type { MenuConfig, MenuState, AntdMenuOption, MenuOption } from './types';
import { getAntdMenus, getRouteMenus } from './utils';

const useConfigStore = createImmer<MenuState>(getDefaultMenuState);
const useMenuStore = createImmer<{ menus: AntdMenuOption[] }>(() => ({
    menus: [],
}));
export const useSetupMenu = <
    T extends Record<string, any> = Record<string, any>,
    M = MenuOption<T>,
>(
    config?: MenuConfig<M>,
) => {
    const { generated: routeGenerated, options: routes } = useRouter();
    const { basePath } = useRouterConfig();
    const { user } = useUser();
    const [configed, setConfiged] = useState<boolean>(false);
    const [shouldChnage, setShouldChange] = useState<boolean>(false);
    const { type, server } = useConfigStore((state) => ({ ...state }), shallow);
    const { getAuthRequest } = useRequest();
    useDeepCompareEffect(() => {
        if (!configed || config) {
            if (config) useConfigStore.setState((draft) => deepMerge(draft, config ?? {}), true);
            setConfiged(true);
        }
    }, [config, configed]);
    useDeepCompareEffect(() => {
        setShouldChange(true);
    }, [configed, user]);
    useDeepCompareEffect(() => {
        if (type === 'router') setShouldChange(true);
    }, [routes, routeGenerated]);
    useAsyncEffect(async () => {
        if (configed && shouldChnage) {
            if (user) {
                const request = getAuthRequest();
                if (type === 'server' && server && request) {
                    try {
                        const { data } = await request.get<MenuOption<T>[]>(server);
                        if (isArray(data)) {
                            useMenuStore.setState((draft) => {
                                draft.menus = data;
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else if (type === 'router' && routeGenerated) {
                    useMenuStore.setState((draft) => {
                        draft.menus = getRouteMenus(routes, { basePath });
                    });
                }
            }
            setShouldChange(false);
        }
    }, [shouldChnage]);
};
export const useMenu = <T extends Record<string, any> = Record<string, any>>() => {
    const menus = useMenuStore((state) => state.menus);
    return {
        menus: useDeepCompareMemo(() => menus, [menus]) as MenuOption<T>[],
        antdMenus: useDeepCompareMemo(() => getAntdMenus(menus), [menus]) as AntdMenuOption<T>[],
    };
};
