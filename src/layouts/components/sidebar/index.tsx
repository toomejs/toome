import { Drawer, Layout } from 'antd';

import { useState, useCallback } from 'react';

import { useResponsiveMobileCheck } from '@/utils/device';

import '../../style.css';

import { useLayout, useLayoutDispatch } from '../hooks';

import { getLayoutCssStyle } from '../utils';

import { EmbedMenu, SideMenu } from './menu';
import { Logo } from './logo';

export const Sidebar = () => {
    const { Sider } = Layout;
    const isMobile = useResponsiveMobileCheck();
    const { menu, theme, mode, collapsed } = useLayout();
    const { vars } = useLayout();
    const { changeCollapse } = useLayoutDispatch();
    const breakPointChange = useCallback((broken: boolean) => {
        if (broken) changeCollapse(true);
    }, []);
    const closeDrawer = useCallback(() => changeCollapse(false), []);
    if (mode === 'top') return null;
    if (mode === 'embed') return <EmbedMenu />;
    if (!isMobile)
        return (
            <Sider
                collapsible
                style={getLayoutCssStyle(vars)}
                theme={theme.sidebar}
                collapsed={collapsed}
                width={vars.sidebarWidth}
                collapsedWidth={vars.sidebarCollapseWidth}
                breakpoint="lg"
                trigger={null}
                onBreakpoint={breakPointChange}
            >
                {mode !== 'content' ? <Logo style={{ backgroundColor: '#000' }} /> : null}
                <SideMenu theme={theme.sidebar} menu={menu} />
            </Sider>
        );

    return (
        <Drawer placement="left" visible={!collapsed} onClose={closeDrawer}>
            {mode !== 'content' ? <Logo style={{ backgroundColor: '#000' }} /> : null}
            <SideMenu theme={theme.sidebar} menu={menu} />
        </Drawer>
    );
};
export const EmbedSidebar = () => {
    const { Sider } = Layout;
    const { menu } = useLayout();
    const [collapse] = useState(false);
    return (
        <Sider
            collapsible
            theme="light"
            collapsed={collapse}
            breakpoint="lg"
            trigger={null}
            onBreakpoint={(broken) => {}}
            onCollapse={(collapsed, type) => {}}
        >
            <SideMenu theme="light" menu={menu} />
        </Sider>
    );
};
