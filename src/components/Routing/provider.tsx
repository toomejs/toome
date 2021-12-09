import { omit } from 'lodash-es';
import { FC, useEffect } from 'react';
import { BrowserRouter, HashRouter, useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import shallow from 'zustand/shallow';

import { useSetupMenu } from '../Menu';

import { useRouter, useSetupRouter, useRouterConfig } from './hooks';
import type { RouterConfig } from './types';

export const RoutesList: FC<{ routes: RouteObject[] }> = ({ routes }) => useRoutes(routes);
export const RouterInit: FC = () => {
    const {
        basePath: basename,
        hash,
        window,
    } = useRouterConfig((state) => ({ ...omit(state, ['routes']) }), shallow);
    const { routes } = useRouter();
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
export const RouterWrapper: FC = () => {
    const { generated } = useRouter();
    useEffect(() => {
        // console.log(generated);
    }, [generated]);
    return generated ? <RouterInit /> : <div>加载中{`${generated}`}</div>;
};
export const Router = <T extends Record<string, any>>({ config }: { config: RouterConfig<T> }) => {
    useSetupRouter<T>(config);
    useSetupMenu();
    return <RouterWrapper />;
};
