import { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { layout } from '@/config';

import { BasicLayout } from './components';

const MasterLayout: FC = () => {
    return (
        <BasicLayout {...layout}>
            <Outlet />
        </BasicLayout>
    );
};
export default MasterLayout;
