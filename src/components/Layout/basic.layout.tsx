import ProLayout from '@ant-design/pro-layout';
import type { ProSettings } from '@ant-design/pro-layout/es';

import { useSafeState } from 'ahooks';
import type { FC } from 'react';

import { useLocation } from 'react-router-dom';

import { useAntdMenus } from '../Menu';

import HeaderRight from './header';
import { MenuItem, SubMenuItem } from './menu';
import { SideFooter } from './sidebar';

const BasicLayout: FC = ({ children }) => {
    const [settings] = useSafeState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
    });
    const location = useLocation();
    const menus = useAntdMenus();
    return (
        <div
            id="app-layout"
            style={{
                height: '100%',
            }}
        >
            <ProLayout
                location={{
                    pathname: location.pathname,
                }}
                // route={{ path: basePath, routes: menus }}
                menuItemRender={MenuItem}
                subMenuItemRender={SubMenuItem}
                // menuRender={() => null}
                menuDataRender={() => menus}
                rightContentRender={HeaderRight}
                menuFooterRender={SideFooter}
                onMenuHeaderClick={(e) => console.log(e)}
                {...settings}
            >
                {children}
                {/* <PageContainer className="h-full" content={children} /> */}
            </ProLayout>
        </div>
    );
};
export default BasicLayout;
