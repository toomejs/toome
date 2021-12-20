import { Card } from 'antd';

import { CpuMonitor, DiskMonitor, MemoryMonitor } from './components';

const Dashboard = () => {
    return (
        <div className="md:container md:mx-auto">
            <div className="w-full grid grid-cols-4">
                <Card>
                    <CpuMonitor />
                </Card>
                <Card>
                    <MemoryMonitor />
                </Card>
                <Card>
                    <DiskMonitor />
                </Card>
                {/* <Card>
                    <PercentGaugeChart
                        config={{ name: '网络' }}
                        value={networkValue}
                        style={{ height: '200px' }}
                    />
                </Card> */}
            </div>
        </div>
    );
};
export default Dashboard;
