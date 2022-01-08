import { Layout } from 'antd';

import { useEffect, useMemo, useState } from 'react';

import { useResponsiveMobileCheck } from '@/utils/device';

import { ConfigDrawer } from './drawer';

import { LayoutHeader } from './header';
import { useLayout } from './hooks';
import { LayoutProvider } from './provider';
import { EmbedSidebar, Sidebar } from './sidebar';
import type { LayoutVarsConfig } from './types';
import style from './styles/index.module.less';
import { getLayoutClasses, getLayoutCssStyle } from './utils';

const SideLayout: FC = ({ children }) => {
    const { Content } = Layout;
    return (
        <>
            <Sidebar />
            <Layout>
                <LayoutHeader />
                <Content>
                    <div style={{ padding: 12 }}>{children}</div>
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
                        <div style={{ padding: 12 }}>{children}</div>
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
                <div style={{ padding: 12 }}>{children}</div>
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
                            <div style={{ padding: 12 }}>{children}</div>
                        </Content>
                    </Layout>
                </Layout>
            </section>
        </>
    );
};
const ProviderWrapper: FC<{ vars?: LayoutVarsConfig }> = ({ children, vars }) => (
    <LayoutProvider vars={vars}>
        <ConfigDrawer>{children}</ConfigDrawer>
    </LayoutProvider>
);
const LayoutWrapper: FC = ({ children }) => {
    const [classes, setClasses] = useState<string>('');
    const isMobile = useResponsiveMobileCheck();
    const { fixed, mode } = useLayout();
    const { vars } = useLayout();
    useEffect(() => {
        setClasses(getLayoutClasses(fixed, mode, style, isMobile));
    }, [fixed, mode, isMobile]);
    const Main = useMemo(() => {
        if (mode === 'top') return <TopLayout>{children}</TopLayout>;
        if (mode === 'content') return <ContentLayout>{children}</ContentLayout>;
        if (mode === 'embed') return <EmbedLayout>{children}</EmbedLayout>;
        return <SideLayout>{children}</SideLayout>;
    }, [mode]);
    return (
        <Layout className={classes} style={getLayoutCssStyle(vars)}>
            {Main}
        </Layout>
    );
};
export const BasicLayout: FC<{ vars?: LayoutVarsConfig }> = ({ children, vars }) => {
    return (
        <ProviderWrapper vars={vars}>
            <LayoutWrapper>{children}</LayoutWrapper>
        </ProviderWrapper>
    );
};
