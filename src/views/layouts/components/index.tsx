import { Layout } from 'antd';

import { useEffect, useMemo, useState } from 'react';

import { useResponsiveMobileCheck } from '@/utils';

import {
    getLayoutClasses,
    getLayoutCssStyle,
    LayoutConfig,
    LayoutProvider,
    useLayout,
} from '@/components/Layout';

import style from '../styles/index.module.less';

import { EmbedSidebar, Sidebar } from './sidebar';
import { LayoutHeader } from './header';
import { ConfigDrawer } from './drawer';

const LayoutContent: FC = ({ children }) => <div className="p-2 h-full">{children}</div>;
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
export const BasicLayout: FC<LayoutConfig> = ({ children, ...rest }) => {
    return (
        <ProviderWrapper {...rest}>
            <LayoutWrapper>{children}</LayoutWrapper>
        </ProviderWrapper>
    );
};
