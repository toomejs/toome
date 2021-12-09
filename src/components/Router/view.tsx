import { pick } from 'lodash-es';
import { useMemo, useState } from 'react';
import type { FC } from 'react';
import { BrowserRouter, HashRouter, useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import type { RouterConfig, AntdRouterConfig } from './types';
import { getRoutes, RouterContext } from './util';

export const Loading: FC = () => (
    <div className="fixed w-full h-full top-0 left-0 dark:bg-white bg-gray-800 bg-opacity-25 flex items-center justify-center">
        <span>加载中</span>
    </div>
);

export const RoutesList: FC<{ routes: RouteObject[] }> = ({ routes }) => useRoutes(routes);
export const RouterWrapper: FC<{
    config: Pick<RouterConfig, 'hash' | 'window' | 'basename'>;
    routes: RouteObject[];
}> = ({ config, routes }) => {
    const { hash, window, basename } = config;

    // const { routes } = useAppRouter();
    return hash ? (
        <HashRouter {...{ window, basename }}>
            <RoutesList routes={routes} />
        </HashRouter>
    ) : (
        <BrowserRouter {...{ window, basename }}>
            <RoutesList routes={routes} />
        </BrowserRouter>
    );
};

export const AppRouter: FC<{ config: RouterConfig | AntdRouterConfig }> = (props) => {
    const [config, setConfig] = useState<RouterConfig>(props.config);
    const basePath = useMemo(() => config.basename ?? '/', [config.basename]);
    const {
        routes,
        menus,
        nameMaps: names,
    } = getRoutes(config.routes ?? [], {
        basePath,
        render: config.render,
    });
    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <RouterContext.Provider value={{ basePath, routes, menus, names, setConfig }}>
            <RouterWrapper
                config={{ ...pick(config, ['window', 'hash']), basename: basePath }}
                routes={routes}
            />
        </RouterContext.Provider>
    );
};
