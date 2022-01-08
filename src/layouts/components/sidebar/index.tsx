import { Drawer, Layout } from 'antd';

import { useCallback } from 'react';

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
    const closeDrawer = useCallback(() => changeCollapse(true), []);
    if (mode === 'top') return null;
    if (mode === 'embed')
        return (
            <Sider
                collapsible
                collapsed
                style={getLayoutCssStyle(vars)}
                theme={theme.sidebar}
                collapsedWidth={vars.sidebarCollapseWidth}
                trigger={null}
            >
                <EmbedMenu />
            </Sider>
        );
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
        <Drawer
            placement="left"
            visible={!collapsed}
            onClose={closeDrawer}
            width={vars.sidebarWidth}
            closable={false}
            bodyStyle={{ padding: 0 }}
        >
            <Sider
                collapsible={false}
                theme={theme.sidebar}
                width="100%"
                style={{ height: '100%' }}
                trigger={null}
            >
                {mode !== 'content' ? <Logo style={{ backgroundColor: '#000' }} /> : null}
                <SideMenu theme={theme.sidebar} menu={menu} />
            </Sider>
        </Drawer>
    );
};
export const EmbedSidebar = () => {
    const { Sider } = Layout;
    const { menu, collapsed, vars } = useLayout();
    return (
        <Sider
            collapsible
            theme="light"
            collapsed={collapsed}
            collapsedWidth={vars.sidebarCollapseWidth}
            trigger={null}
        >
            <SideMenu theme="light" menu={menu} />
        </Sider>
    );
};
