import { useAsyncEffect } from 'ahooks';
import { Button, Card, Col, Row } from 'antd';
import { useCallback, useState } from 'react';

import { useFetcher } from '@/components/Fetcher';

import { ServerApp, ServerInfo } from './components';
import type { ServerItem } from './types';

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
    const [server, setServer] = useState<ServerItem>();
    const changeAnalysis = useCallback((tab: string) => setAnalysis(tab), []);
    const fetcher = useFetcher();
    useAsyncEffect(async () => {
        try {
            const { data } = await fetcher.get<ServerItem>('/servers', {
                params: { id: '1' },
            });
            setServer(data);
        } catch (err) {
            console.log(err);
        }
    }, []);
    return (
        <div className="md:container md:mx-auto">
            <Row gutter={[8, 16]}>
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
                        <ServerInfo data={server} />
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
