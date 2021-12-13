import { useDeepCompareEffect } from 'ahooks';

import merge from 'deepmerge';

import { isArray } from 'lodash-es';
import { useEffect, useRef } from 'react';

import shallow from 'zustand/shallow';

import { useUser } from '../Auth';

import { useFetcher } from '../Request';

import { useRouterStore } from './hooks';

import type { RouterConfig, RouteOption } from './types';
import { factoryRoutes, filteAccessRoutes, filteWhiteList, AuthRedirect } from './utils';

export const useSetupRouter = <T extends RecordAnyOrNever>(config: RouterConfig<T>) => {
    const setuped = useRef<boolean>(false);
    const fecher = useFetcher();
    const user = useUser();
    const { configed, signal, routes } = useRouterStore(
        (state) => ({
            configed: state.config,
            routes: state.routes,
            signal: state.signal,
        }),
        shallow,
    );

    useDeepCompareEffect(() => {
        if (!setuped.current && config) {
            useRouterStore.setState((state) => {
                state.config = merge(state.config, config ?? {}, {
                    arrayMerge: (_d, s, _o) => s,
                }) as any;
                state.signal.shouldChange = !state.config.auth.enabled;
            }, true);
            setuped.current = true;
        }
    }, [config]);
    useEffect(() => {
        if (signal.shouldChange) {
            useRouterStore.setState((state) => {
                state.signal.shouldChange = false;
                state.signal.canGenerate = false;
                state.signal.generated = false;
            });
            if (!configed.auth.enabled) {
                useRouterStore.setState((state) => {
                    state.routes = [
                        ...state.config.routes.constants,
                        ...state.config.routes.dynamic,
                    ];
                    state.signal.canGenerate = true;
                });
            } else if (user) {
                useRouterStore.setState((state) => {
                    state.routes = filteAccessRoutes(
                        user,
                        state.config.routes.constants,
                        configed.auth,
                        {
                            basePath: configed.basePath,
                        },
                    );
                });
                if (!configed.server) {
                    useRouterStore.setState((state) => {
                        state.routes = filteAccessRoutes(
                            user,
                            [...state.routes, ...state.config.routes.dynamic],
                            configed.auth,
                            {
                                basePath: configed.basePath,
                            },
                        );
                        state.signal.canGenerate = true;
                    });
                } else {
                    fecher()
                        .get<RouteOption[]>(configed.server)
                        .then(({ data }) => {
                            if (isArray(data)) {
                                useRouterStore.setState((state) => {
                                    state.routes = [...state.routes, ...data];
                                    state.signal.canGenerate = true;
                                });
                            }
                        });
                }
            } else {
                useRouterStore.setState((state) => {
                    state.routes = [
                        ...filteWhiteList(state.config.routes.constants, configed.auth, {
                            basePath: configed.basePath,
                        }),
                        ...filteWhiteList(state.config.routes.dynamic, configed.auth, {
                            basePath: configed.basePath,
                        }),
                    ];
                    state.signal.shouldChange = false;
                    state.signal.canGenerate = true;
                });
            }
        }
    }, [signal.shouldChange]);
    useDeepCompareEffect(() => {
        if (signal.canGenerate) {
            const { nameMaps, routes: renders } = factoryRoutes(routes, {
                basePath: configed.basePath,
                render: configed.render,
            });
            useRouterStore.setState((state) => {
                state.names = nameMaps;
                state.renders = renders;
                if (state.config.auth.enabled && !user && state.config.auth.redirect === 'login') {
                    state.renders.push({
                        path: '*',
                        element: <AuthRedirect loginPath={state.config.auth.login_path} />,
                    });
                }
                state.signal.canGenerate = false;
                state.signal.generated = true;
            });
        }
    }, [signal.canGenerate]);
};
