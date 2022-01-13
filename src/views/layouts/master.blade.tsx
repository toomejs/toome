import { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { layout } from '@/config';

import { RouteOption } from '@/components/Router';

import { BasicLayout } from './components';

const MasterLayout: FC<{ route: RouteOption }> = ({ route }) => {
    return (
        <BasicLayout {...layout}>
            <Outlet />
        </BasicLayout>
    );
};
export default MasterLayout;
