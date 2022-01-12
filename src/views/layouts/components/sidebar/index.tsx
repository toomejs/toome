import { Drawer, Layout } from 'antd';

import { useCallback, useState } from 'react';

import { CollapseType } from 'antd/lib/layout/Sider';

import { useDebounceFn, useUpdateEffect } from 'ahooks';

import { useResponsiveMobileCheck } from '@/utils';

import { getLayoutCssStyle, useLayout, useLayoutDispatch } from '@/components/Layout';

import { EmbedMenu, SideMenu } from './menu';
import { Logo } from './logo';

export const Sidebar = () => {
    const { Sider } = Layout;
    const isMobile = useResponsiveMobileCheck();
    const {
        menu,
        config: { theme, mode, collapsed, vars },
        mobileSide,
    } = useLayout();
    const { changeCollapse, changeMobileSide } = useLayoutDispatch();
    const [collapse, setCollapse] = useState(collapsed);

    useUpdateEffect(() => {
        setCollapse(collapsed);
    }, [collapsed]);
    const { run: onCollapse } = useDebounceFn(
        (value: boolean, type: CollapseType) => {
            if (!isMobile && type === 'responsive') changeCollapse(true);
        },
        { wait: 100 },
    );
    const closeDrawer = useCallback(() => changeMobileSide(false), []);
    if (!isMobile) {
        if (mode === 'top') return null;
        if (mode === 'embed') {
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
        }
        return (
            <Sider
                collapsible
                style={getLayoutCssStyle(vars)}
                theme={theme.sidebar}
                collapsed={collapse}
                width={vars.sidebarWidth}
                // onBreakpoint={onBreakpoint}
                collapsedWidth={vars.sidebarCollapseWidth}
                breakpoint="lg"
                onCollapse={onCollapse}
                trigger={null}
            >
                {mode !== 'content' ? <Logo style={{ backgroundColor: '#000' }} /> : null}
                <SideMenu theme={theme.sidebar} menu={menu} />
            </Sider>
        );
    }

    return (
        <Drawer
            placement="left"
            visible={mobileSide}
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
                <Logo style={{ backgroundColor: '#000' }} />
                <SideMenu theme={theme.sidebar} menu={menu} />
            </Sider>
        </Drawer>
    );
};
export const EmbedSidebar = () => {
    const { Sider } = Layout;
    const {
        menu,
        config: { collapsed, vars },
    } = useLayout();
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
