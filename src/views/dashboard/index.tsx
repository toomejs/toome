import { FC, useEffect, useState } from 'react';
import type * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import type { GaugeSeriesOption } from 'echarts/charts';

import produce from 'immer';

import { isArray } from 'lodash-es';

import { Chart } from '@/components/Charts';

import { cpuOptions } from './data';

const Dashboard: FC = () => {
    const random = +(Math.random() * 60).toFixed(2);
    const [cpuData, setCpuData] = useState<echarts.ComposeOption<GaugeSeriesOption>>(cpuOptions);
    useEffect(() => {
        setTimeout(() => {
            setCpuData(
                produce((state) => {
                    isArray(state.series) &&
                        state.series.forEach((s) => {
                            s.data = [{ value: random }];
                        });
                }),
            );
        }, 1000);
    }, []);
    return (
        <div className="md:container md:mx-auto">
            <div className="flex">
                <div>
                    <Chart
                        options={cpuData}
                        exts={[GaugeChart]}
                        style={{ width: '330px', height: '300px' }}
                    />
                </div>
                <div>memory</div>
                <div>disk</div>
                <div>network</div>
            </div>
        </div>
    );
};
export default Dashboard;
