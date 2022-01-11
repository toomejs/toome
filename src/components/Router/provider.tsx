/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-14 00:07:50 +0800
 * Updated_at     : 2022-01-09 14:29:57 +0800
 * Path           : /src/components/Router/provider.tsx
 * Description    : 路由组件包装器
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import {
    BrowserRouter,
    HashRouter,
    matchRoutes,
    renderMatches,
    useLocation,
    RouteObject,
} from 'react-router-dom';

import { useRouter, useRouterStatus } from './hooks';

/**
 * 根据路由渲染列表生成react router路由表
 * 也可以直接使用内置的`useRoutes`来替代
 * @param props
 */
const RoutesList: FC<{ routes: RouteObject[]; basename: string }> = ({ routes, basename }) => {
    const location = useLocation();
    return renderMatches(matchRoutes(routes, location, basename));
};
/**
 * 路由渲染组件,用于渲染最终路由
 */
const RouterRender: FC = () => {
    const { basePath: basename, hash, window } = useRouter.useConfig();
    const renders = useRouter.useRenders();
    return hash ? (
        <HashRouter {...{ window, basename }}>
            <RoutesList routes={renders} basename={basename} />
        </HashRouter>
    ) : (
        <BrowserRouter {...{ window, basename }}>
            <RoutesList routes={renders} basename={basename} />
        </BrowserRouter>
    );
};
/**
 * 路由组件包装器,在路由渲染列表生成后立即渲染路由
 */
export const Router = () => {
    const success = useRouterStatus.useSuccess();
    return success ? <RouterRender /> : null;
};
