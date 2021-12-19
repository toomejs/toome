import { useDeepCompareEffect } from 'ahooks';
import { Button } from 'antd';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { BarChart } from 'echarts/charts';

import { Icon } from '@/components/Icon';
import { useStorage, useStorageStore } from '@/components/Storage';
import { useThemeDispatch } from '@/components/Theme';

import { Chart } from '@/components/Charts';

import IconAccountBox from '~icons/mdi/account-box';

const DoF: FC = () => {
    const config = useStorageStore.useConfig();
    useDeepCompareEffect(() => {
        // console.log(config);
    }, [config]);
    // console.log('渲染变量1');
    return <div>fff</div>;
};
const DoK: FC = () => {
    const doF = useStorageStore.useDoF();
    // console.log('渲染变量2');
    return <div>{doF.toString()}</div>;
};
const DoQ: FC = () => {
    const { addTable } = useStorage();
    // console.log('渲染操作1');
    return (
        <Button
            type="primary"
            onClick={() => {
                addTable({ name: 'test' });
            }}
        >
            Change Config
        </Button>
    );
};
const DoIn: FC = () => {
    const { toggleTheme } = useThemeDispatch();
    // console.log('渲染操作2');
    return (
        <>
            <Link to="/auth/signup">Link</Link>
            <Button type="primary" onClick={() => toggleTheme()} icon={<Icon name="if:biji" />}>
                Change Theme1
            </Button>
            <Button
                type="primary"
                onClick={() => toggleTheme()}
                icon={<Icon component={IconAccountBox} rotate={122} />}
            >
                Change Theme2
            </Button>
            <Button
                type="primary"
                onClick={() => toggleTheme()}
                icon={<Icon name="fy:la:bacon" spin />}
            >
                Change Theme3
            </Button>
            <Chart
                exts={[BarChart]}
                options={{
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [
                        {
                            data: [120, 200, 150, 80, 70, 110, 130],
                            type: 'bar',
                        },
                    ],
                }}
            />
        </>
    );
};
const Dashboard: FC = () => {
    return (
        <div>
            Dashboard
            <DoF />
            <DoQ />
            <DoIn />
            {/* <DoK /> */}
        </div>
    );
};
export default Dashboard;
