import type { FC } from 'react';
import {
    BrowserRouter,
    HashRouter,
    matchRoutes,
    renderMatches,
    useLocation,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { useRouter } from './hooks';

const RoutesList: FC<{ routes: RouteObject[]; basename: string }> = ({ routes, basename }) => {
    const location = useLocation();
    return renderMatches(matchRoutes(routes, location, basename));
};
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
export const Router = () => {
    const { generated } = useRouter.useSignal();
    return generated ? <RouterRender /> : <div>加载中{`${generated}`}</div>;
};
