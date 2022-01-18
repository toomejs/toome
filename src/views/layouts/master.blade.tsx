import { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { layout } from '@/config';

import { RouteComponentProps } from '@/components/Router';

import { BasicLayout } from './components';

const MasterLayout: FC<{ route: RouteComponentProps }> = ({ route }) => {
    return (
        <BasicLayout config={layout} route={route}>
            <Outlet />
        </BasicLayout>
    );
};
export default MasterLayout;
