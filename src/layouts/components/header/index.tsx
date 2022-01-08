import { Layout, Space } from 'antd';

import { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';

import produce from 'immer';

import { useTheme, useThemeDispatch } from '@/components/Config';

import { Icon } from '@/components/Icon';

import { useResponsiveMobileCheck } from '@/utils';

import { SideMenu } from '../sidebar/menu';

import { useDrawer, useDrawerChange } from '../drawer/hooks';

import { useLayout, useLayoutDispatch } from '../hooks';

import { Logo } from '../sidebar/logo';

import { getLayoutCssStyle } from '../utils';

import Sun from '~icons/carbon/sun';
import Moon from '~icons/carbon/moon';
import Settings from '~icons/carbon/settings';
import MenuFold from '~icons/ant-design/menu-fold-outlined';
import MenuUnFold from '~icons/ant-design/menu-unfold-outlined';

const Theme = () => {
    const theme = useTheme();
    const { toggleTheme } = useThemeDispatch();
    return theme === 'dark' ? (
        <Icon component={Moon} className="cursor-pointer" onClick={toggleTheme} />
    ) : (
        <Icon component={Sun} className="cursor-pointer" onClick={toggleTheme} />
    );
};
const Setting = () => {
    const drawer = useDrawer();
    const changeDrawerVisible = useDrawerChange();
    const toggleDrawer = useCallback(() => changeDrawerVisible(!drawer), [drawer]);
    return <Icon component={Settings} className="cursor-pointer" onClick={toggleDrawer} />;
};
const defaultClasses = ['flex', 'content-between', '!px-[15px]'];
export const LayoutHeader = () => {
    const { Header } = Layout;
    const isMobile = useResponsiveMobileCheck();
    const { mode, theme, menu, fixed, collapsed } = useLayout();
    const { toggleCollapse, toggleMobileSide } = useLayoutDispatch();
    const [classes, setClasses] = useState<string>('');
    const { vars } = useLayout();
    const sideCtrol = useCallback(
        () => (isMobile ? toggleMobileSide() : toggleCollapse()),
        [isMobile],
    );
    useEffect(() => {
        setClasses(
            produce(() => {
                const items = defaultClasses;
                if (theme.header === 'dark') {
                    items.push('!text-[rgba(255,255,255,0.65)]');
                } else {
                    items.push('!bg-white');
                }
                return classNames(items);
            }),
        );
    }, [theme.header, fixed.header]);
    return (
        <Header className={classes} style={getLayoutCssStyle(vars)}>
            <Space>
                {mode === 'content' ? (
                    <div className="flex-none">
                        <Logo style={{ backgroundColor: '#000', height: '30px', width: '150px' }} />
                    </div>
                ) : null}
                <Icon
                    component={collapsed ? MenuUnFold : MenuFold}
                    className="cursor-pointer"
                    onClick={sideCtrol}
                />
            </Space>
            <div className="flex-auto">
                {mode === 'top' ? (
                    <SideMenu mode="horizontal" theme={theme.header} menu={menu} />
                ) : null}
            </div>
            <Space className="flex-none">
                <Theme />
                <Setting />
            </Space>
        </Header>
    );
};
