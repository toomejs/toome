import { Layout } from 'antd';

import { useContext, useEffect, useMemo, useState } from 'react';

import { useResponsiveMobileCheck } from '@/utils';

import {
    getLayoutClasses,
    getLayoutCssStyle,
    LayoutConfig,
    LayoutProvider,
    useLayout,
} from '@/components/Layout';

import { LayoutRouteInfo } from '@/components/Layout/store';

import { RouteComponentProps } from '@/components/Router';

import { KeepAlive } from '@/components/KeepAlive';

import style from '../styles/index.module.less';

import { EmbedSidebar, Sidebar } from './sidebar';
import { LayoutHeader } from './header';
import { ConfigDrawer } from './drawer';
import { LayoutTabs } from './tabs';

const LayoutContent: FC = ({ children }) => {
    const route = useContext(LayoutRouteInfo);
    if (route)
        return (
            <>
                <LayoutTabs />
                <div className="p-2 h-full">
                    <KeepAlive route={route}>{children}</KeepAlive>
                </div>
            </>
        );
    return <div className="p-2 h-full">{children}</div>;
};
const SideLayout: FC = ({ children }) => {
    const { Content } = Layout;
    return (
        <>
            <Sidebar />
            <Layout>
                <LayoutHeader />
                <Content>
                    <LayoutContent>{children}</LayoutContent>
                </Content>
            </Layout>
        </>
    );
};
const ContentLayout: FC = ({ children }) => {
    const { Content } = Layout;
    return (
        <>
            <LayoutHeader />
            <section className="layout-main">
                <Layout>
                    <Sidebar />
                    <Content>
                        <LayoutContent>{children}</LayoutContent>
                    </Content>
                </Layout>
            </section>
        </>
    );
};
const TopLayout: FC = ({ children }) => {
    const { Content } = Layout;
    return (
        <>
            <LayoutHeader />
            <Content>
                <LayoutContent>{children}</LayoutContent>
            </Content>
        </>
    );
};
const EmbedLayout: FC = ({ children }) => {
    const { Content } = Layout;
    return (
        <>
            <Sidebar />
            <section className="layout-main">
                <Layout>
                    <EmbedSidebar />
                    <Layout>
                        <LayoutHeader />
                        <Content>
                            <LayoutContent>{children}</LayoutContent>
                        </Content>
                    </Layout>
                </Layout>
            </section>
        </>
    );
};
const ProviderWrapper: FC<LayoutConfig> = ({ children, ...rest }) => (
    <LayoutProvider {...rest}>
        <ConfigDrawer>{children}</ConfigDrawer>
    </LayoutProvider>
);
const LayoutWrapper: FC = ({ children }) => {
    const [classes, setClasses] = useState<string>('');
    const isMobile = useResponsiveMobileCheck();
    const {
        config: { fixed, mode, vars },
    } = useLayout();
    useEffect(() => {
        setClasses(getLayoutClasses(fixed, mode, style, isMobile));
    }, [fixed, mode, isMobile]);
    const Main = useMemo(() => {
        if (!isMobile) {
            if (mode === 'top') return <TopLayout>{children}</TopLayout>;
            if (mode === 'content') return <ContentLayout>{children}</ContentLayout>;
            if (mode === 'embed') return <EmbedLayout>{children}</EmbedLayout>;
        }
        return <SideLayout>{children}</SideLayout>;
    }, [mode, isMobile]);
    return (
        <Layout className={classes} style={getLayoutCssStyle(vars)}>
            {Main}
        </Layout>
    );
};
export const BasicLayout: FC<{ config: LayoutConfig; route: RouteComponentProps }> = ({
    children,
    config,
    route,
}) => {
    return (
        <ProviderWrapper {...config}>
            <LayoutRouteInfo.Provider value={route}>
                <LayoutWrapper>{children}</LayoutWrapper>
            </LayoutRouteInfo.Provider>
        </ProviderWrapper>
    );
};
