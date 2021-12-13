import type { FC } from 'react';

import { Outlet } from 'react-router-dom';

import BasicLayout from '@/components/Layout/basic.layout';

// import { AppFooter, AppHeader, AppSidebar } from './components';

const MasterLayout: FC = () => {
    return (
        <BasicLayout>
            <Outlet />
        </BasicLayout>
        // <article>
        //     <AppSidebar />
        //     <main>
        //         <AppHeader />
        //         <div className="content">
        //             <Outlet />
        //         </div>
        //         <AppFooter />
        //     </main>
        // </article>
    );
};
export default MasterLayout;
