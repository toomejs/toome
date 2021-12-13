import type { ProSettings } from '@ant-design/pro-layout/es';
import ProLayout, { PageContainer } from '@ant-design/pro-layout/es';

import { useSafeState } from 'ahooks';
import type { FC } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { useAntdMenus } from '../Menu';
import { useRouter } from '../Router';

import { HeaderRight } from './header';
import { MenuItem, SubMenuItem } from './menu';
import { SideFooter } from './sidebar';

const BasicLayout: FC = ({ children }) => {
    const [settings] = useSafeState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
    });
    const location = useLocation();
    const menus = useAntdMenus();
    const { basePath } = useRouter.useConfig();
    return (
        <div
            id="app-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProLayout
                location={{
                    pathname: location.pathname,
                }}
                route={{ path: basePath, routes: menus }}
                menuItemRender={MenuItem}
                subMenuItemRender={SubMenuItem}
                rightContentRender={HeaderRight}
                menuFooterRender={SideFooter}
                onMenuHeaderClick={(e) => console.log(e)}
                {...settings}
            >
                <PageContainer content={children} />
                <Link to="/auth/signup">test</Link>
            </ProLayout>
        </div>
    );
};
export default BasicLayout;
