import { UserOutlined } from '@ant-design/icons';

import type { MenuDataItem, ProSettings } from '@ant-design/pro-layout';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';

import { Avatar } from 'antd';

import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useMenu } from '../Menu';

import { useLocationPath } from '../Router';

const MenuItem: (
    item: MenuDataItem & {
        isUrl: boolean;
        onClick: () => void;
    },
    dom: React.ReactNode,
) => React.ReactNode = (item, dom) => {
    const { basePath } = useLocationPath();
    const navigate = useNavigate();
    if (item.isUrl) {
        return (
            <a href={item.path} target={item.target ?? '_blank'}>
                {dom}
            </a>
        );
    }
    return (
        <a
            onClick={(e) => {
                e.preventDefault();
                navigate(item.path ?? basePath);
            }}
        >
            {dom}
        </a>
    );
};
const subMenuItem: (item: MenuDataItem, dom: React.ReactNode) => React.ReactNode = (item, dom) => (
    <div ref={(el) => el && el.addEventListener('selectstart', (e) => e.preventDefault())}>
        {dom}
    </div>
);
export default () => {
    const [settings] = useState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
    });
    const { pathname } = useLocationPath();
    const { antdMenus } = useMenu();
    return (
        <div
            id="app-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProLayout
                location={{
                    pathname,
                }}
                route={{ path: '/', routes: antdMenus }}
                // eslint-disable-next-line react/no-unstable-nested-components
                subMenuItemRender={subMenuItem}
                // eslint-disable-next-line react/no-unstable-nested-components
                menuFooterRender={(props) => {
                    return (
                        <a
                            style={{
                                lineHeight: '48rpx',
                                display: 'flex',
                                height: 48,
                                color: 'rgba(255, 255, 255, 0.65)',
                                alignItems: 'center',
                            }}
                            href="https://preview.pro.ant.design/dashboard/analysis"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                alt="pro-logo"
                                src="https://procomponents.ant.design/favicon.ico"
                                style={{
                                    width: 16,
                                    height: 16,
                                    margin: '0 16px',
                                    marginRight: 10,
                                }}
                            />
                            {!props?.collapsed && 'Preview Pro'}
                        </a>
                    );
                }}
                onMenuHeaderClick={(e) => console.log(e)}
                // eslint-disable-next-line react/no-unstable-nested-components
                menuItemRender={MenuItem}
                // eslint-disable-next-line react/no-unstable-nested-components
                rightContentRender={() => (
                    <div>
                        <Avatar shape="square" size="small" icon={<UserOutlined />} />
                    </div>
                )}
                {...settings}
            >
                <PageContainer content={<Outlet />} />
            </ProLayout>
        </div>
    );
};
