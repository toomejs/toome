import type { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { BasicLayout } from './components';

// import { AppFooter, AppHeader, AppSidebar } from './components';

const MasterLayout: FC = () => {
    return (
        <BasicLayout>
            <Outlet />
        </BasicLayout>
    );
};
export default MasterLayout;
