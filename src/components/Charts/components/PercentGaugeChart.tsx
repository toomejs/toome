import { useCallback, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import type * as echarts from 'echarts/core';
import type { GaugeSeriesOption } from 'echarts/charts';
import { produce } from 'immer';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { GaugeChart } from 'echarts/charts';

import { omit } from 'lodash-es';

import { deepMerge } from '@/utils';

import { Chart } from '../chart';

type EChartsOption = echarts.ComposeOption<GaugeSeriesOption>;
type ChartProps = {
    config?: Omit<GaugeSeriesOption, 'data'> & {
        click?: (chart: echarts.ECharts) => void;
    };
    style?: CSSProperties;
    data: NonNullable<GaugeSeriesOption['data']>;
};
export const PercentGaugeChart: FC<ChartProps> = ({ config, data = [], style = {} }) => {
    const [options, setOptions] = useState<EChartsOption>(defaultOptions);
    const [chart, setChart] = useState<echarts.ECharts>();
    useEffectOnce(() => {
        setOptions(
            produce((draft) => {
                if (config) {
                    draft.series![0] = deepMerge(
                        draft.series![0],
                        omit(config, ['id', 'data']),
                        'replace',
                    );
                    draft.series![0].data = data;
                }
            }),
        );
    });
    useUpdateEffect(() => {
        if (chart && config?.click) {
            chart.getZr().off('click');
            chart.getZr().on('click', () => config.click && config.click(chart));
        }
    }, [chart]);
    useUpdateEffect(() => {
        if (data.length > 0) {
            setOptions(
                produce((draft) => {
                    draft.series![0].data = data;
                }),
            );
        }
    }, [data]);

    return (
        <Chart
            options={options}
            exts={[GaugeChart]}
            style={style}
            create={useCallback(setChart, [])}
        />
    );
};

const defaultOptions: EChartsOption = {
    series: [
        {
            name: 'PercentGauge',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '100%',
            // startAngle: 90,
            // endAngle: -270,
            splitNumber: 1,
            itemStyle: {
                color: '#FFAB91',
            },
            progress: {
                show: true,
                overlap: true,
                roundCap: true,
            },

            title: {
                fontSize: 12,
                offsetCenter: ['0', '70%'],
            },

            pointer: {
                show: true,
            },
            axisLine: {
                lineStyle: {
                    width: 15,
                },
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            detail: {
                width: 40,
                height: 14,
                fontSize: 14,
                color: '#fff',
                backgroundColor: 'inherit',
                borderRadius: 3,
                offsetCenter: ['0', '90%'],
                formatter: '{value}%',
            },
            data: [],
        },
    ],
};
