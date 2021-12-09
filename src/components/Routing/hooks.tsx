import { useAsyncEffect, useDeepCompareEffect } from 'ahooks';

import merge from 'deepmerge';
import { dequal } from 'dequal';
import { isArray } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RouteObject } from 'react-router-dom';

import shallow from 'zustand/shallow';

import { useDeepCompareMemo } from '@/hooks';
import { createImmer } from '@/utils/store';

import { useAuth, useUser } from '../Auth';
import type { User } from '../Auth';
import { useRequest } from '../Request';

import { getDefaultState } from './_defaultConfig';

import { AuthRedirect } from './redirect';
import type { RouteOption, RouterConfig, RouterState } from './types';
import { filteWhiteList, filteAccessRoutes, factoryRoutes } from './utils';

const useSetupStore = createImmer<{ shouldChange: boolean; generated: boolean }>(() => ({
    shouldChange: false,
    generated: false,
}));
export const useRouterConfig = createImmer<RouterState>(() => getDefaultState());
const useRoutesStore = createImmer<{ constants: RouteOption[]; dynamic: RouteOption[] }>(() => ({
    constants: [],
    dynamic: [],
}));
const useDataStore = createImmer<{ routes: RouteObject[]; names: Record<string, string> }>(() => ({
    routes: [],
    names: {},
}));

export const useSetupRouter = <T extends Record<string, any>>(config: RouterConfig<T>) => {
    const { token, setuped: AuthSetuped } = useAuth();
    const { requested, user } = useUser();
    const { getAuthRequest } = useRequest();
    const [canGenerate, setCanGenerate] = useState<boolean>(false);
    const routerState = useRouterConfig((state) => ({ ...state }), shallow);
    const { auth, basePath, render, server, routes } = routerState;
    const shouldChange = useSetupStore((state) => state.shouldChange);
    const { constants, dynamic } = useRoutesStore(
        (state) => ({ constants: state.constants, dynamic: state.dynamic }),
        shallow,
    );
    const [userChanged, setUserChanged] = useState<boolean>(false);
    const userRef = useRef<User | null>(user);
    useEffect(() => {
        setUserChanged(!dequal(userRef.current, user));
    }, [user]);
    useEffect(() => {
        if (config) {
            useRouterConfig.setState(
                () => merge(routerState, config, { arrayMerge: (_d, s, _o) => s }),
                true,
            );
            useSetupStore.setState((state) => {
                state.shouldChange = true;
            });
        }
    }, [config]);
    useEffect(() => {
        useSetupStore.setState((state) => {
            state.shouldChange = true;
        });
    }, [userChanged, requested, token, AuthSetuped]);
    useAsyncEffect(async () => {
        setCanGenerate(false);
        if (!shouldChange) return;
        useSetupStore.setState((state) => {
            state.shouldChange = false;
        });
        if (!auth.enabled) {
            useRoutesStore.setState((draft) => {
                draft.constants = routes.constants;
            });
            useRoutesStore.setState((draft) => {
                draft.dynamic = routes.dynamic;
            });
            return;
        }
        if (user) {
            if (!userChanged) return;
            useRoutesStore.setState((draft) => {
                draft.constants = filteAccessRoutes(user, routes.constants, auth, {
                    basePath,
                });
            });
            const request = getAuthRequest();
            if (!server) {
                useRoutesStore.setState((draft) => {
                    draft.dynamic = filteAccessRoutes(user, routes.dynamic, auth, {
                        basePath,
                    });
                });
            } else if (request && server) {
                try {
                    const { data } = await request.get<RouteOption[]>(server);
                    if (isArray(data)) {
                        useRoutesStore.setState((draft) => {
                            draft.dynamic = data;
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else if (requested || (!token && AuthSetuped)) {
            useRoutesStore.setState((draft) => {
                draft.constants = filteWhiteList(routes.constants, auth, {
                    basePath,
                });
            });
            useRoutesStore.setState((draft) => {
                draft.dynamic = filteWhiteList(routes.dynamic, auth, {
                    basePath,
                });
            });
        }
        setCanGenerate(true);
    }, [shouldChange]);
    useDeepCompareEffect(() => {
        if (canGenerate) {
            const { routes: items, nameMaps } = factoryRoutes([...constants, ...dynamic], {
                basePath,
                render,
            });
            useDataStore.setState((state) => {
                state.routes = items;
                if (auth.enabled && !user && auth.redirect === 'login') {
                    state.routes.push({
                        path: '*',
                        element: <AuthRedirect loginPath={auth.login_path} />,
                    });
                }
            });
            useDataStore.setState((state) => {
                state.names = nameMaps;
            });
            useSetupStore.setState((state) => {
                state.generated = true;
            });
        }
    }, [constants, dynamic]);
};
export const useRouter = <T extends Record<string, any> = Record<string, any>>() => {
    const generated = useSetupStore((state) => state.generated);
    const names = useDataStore((state) => state.names);
    const routes = useDataStore((state) => state.routes);
    const options = useRoutesStore((state) => ({ ...state }), shallow);
    const addRoutes = useCallback((items: RouteOption<T>[]) => {
        useRouterConfig.setState((state) => {
            state.routes.dynamic = [...state.routes.dynamic, ...items];
        });
    }, []);
    const setRoutes = useCallback((items: RouteOption<T>[]) => {
        useRouterConfig.setState((state) => {
            state.routes.dynamic = items;
        });
    }, []);
    return {
        generated,
        names,
        options: useDeepCompareMemo(
            () => [...options.constants, ...options.dynamic],
            [options],
        ) as RouteOption<T>[],
        routes,
        addRoutes,
        setRoutes,
    };
};
