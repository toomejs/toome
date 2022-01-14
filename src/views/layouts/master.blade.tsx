import { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { layout } from '@/config';

import { RouteComponentProps } from '@/components/Router';

import { BasicLayout } from './components';

const MasterLayout: FC<{ route: RouteComponentProps }> = ({ route }) => {
    // const location = useLocation();
    // const matches = matchRoutes(factoryRenders(route.children ?? []), location, route.path.base);
    // console.log(matches);
    // console.log(route);
    return (
        <BasicLayout config={layout} route={route}>
            <Outlet />
        </BasicLayout>
    );
};
export default MasterLayout;
