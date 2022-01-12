import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Menu, Row } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useCallback, useState } from 'react';

import { ServerApp, ServerInfo } from './components';

const analysisTabs = [
    {
        key: 'network',
        tab: '网络',
    },
    {
        key: 'load',
        tab: '负载',
    },
    {
        key: 'io',
        tab: '读写io',
    },
];
const analysisPanel = {
    network: <p>load content</p>,
    // network: <NetworkPanel />,
    load: <p>load content</p>,
    io: <p>sdsd</p>,
};
const Dashboard = () => {
    const [analysis, setAnalysis] = useState('network');
    const changeAnalysis = useCallback((tab: string) => {
        setAnalysis(tab);
    }, []);
    return (
        <div className="md:container md:mx-auto">
            <Row gutter={[8, 16]}>
                <Col span={24}>
                    <Menu theme="light" selectedKeys={['1']} mode="horizontal">
                        <Menu.Item key="mail" icon={<MailOutlined />}>
                            Navigation One
                        </Menu.Item>
                        <Menu.Item key="app" disabled icon={<AppstoreOutlined />}>
                            Navigation Two
                        </Menu.Item>
                        <SubMenu
                            key="SubMenu"
                            icon={<SettingOutlined />}
                            title="Navigation Three - Submenu"
                        >
                            <Menu.ItemGroup title="Item 1">
                                <Menu.Item key="setting:1">Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                            </Menu.ItemGroup>
                            <Menu.ItemGroup title="Item 2">
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu>
                        <Menu.Item key="alipay">
                            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                                Navigation Four - Link
                            </a>
                        </Menu.Item>
                    </Menu>
                </Col>
                <Col span={24}>
                    <Card
                        title="状态"
                        bordered={false}
                        className="w-full"
                        bodyStyle={{
                            paddingTop: '10px',
                            paddingBottom: '10px',
                        }}
                        extra={
                            <>
                                <Button type="primary" className="mr-1">
                                    登录
                                </Button>
                                <Button className="mr-1">关机</Button>
                                <Button className="mr-1">重启</Button>
                                <Button>重置密码</Button>
                            </>
                        }
                    >
                        <Row>
                            <Col span={4}>{/* <CpuMonitor /> */}</Col>
                            <Col span={4}>{/* <MemoryMonitor /> */}</Col>
                            <Col span={4}>{/* <CacheBufferMonitor /> */}</Col>
                            <Col span={4}>{/* <DiskMonitor /> */}</Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={24} xl={8}>
                    <Card className="w-full">
                        <ServerInfo />
                    </Card>
                </Col>
                <Col span={24} xl={16}>
                    <Card
                        style={{ width: '100%' }}
                        tabList={analysisTabs}
                        activeTabKey={analysis}
                        onTabChange={changeAnalysis}
                    >
                        {analysisPanel[analysis]}
                    </Card>
                </Col>
                <Col span={24}>
                    <ServerApp />
                </Col>
            </Row>
        </div>
    );
};
export default Dashboard;
