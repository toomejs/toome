import { useRef, useState } from 'react';
import type { FC } from 'react';
import type * as echarts from 'echarts/core';
import type { GaugeSeriesOption } from 'echarts/charts';
import { produce } from 'immer';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { GaugeChart } from 'echarts/charts';

import { omit } from 'lodash-es';

import { deepMerge } from '@/utils';

import { Chart } from '../chart';
import type { ParentRef } from '../chart';
import type { GaugeChartProps } from '../types';

type EChartsOption = echarts.ComposeOption<GaugeSeriesOption>;
export const PercentGaugeChart: FC<GaugeChartProps> = ({
    config,
    data = [],
    style = {},
    loading = {},
}) => {
    const [options, setOptions] = useState<EChartsOption>(defaultOptions);
    const ref = useRef<ParentRef>(null);
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
        if (ref.current) {
            ref.current.dispatch((chart) => {
                if (config?.click && chart && chart.getZr()) {
                    const zr = chart.getZr();
                    zr.off('click');
                    zr.off('mouseover');
                    zr.on('click', () => config.click && config.click(chart));
                    zr.on('mouseover', () => {
                        const canvas = chart.getDom().querySelectorAll('canvas');
                        if (canvas.length > 0) canvas[0].style.cursor = 'pointer';
                    });
                }
            });
        }
        return () => {
            if (ref.current && config?.click) {
                ref.current.dispatch((chart) => {
                    if (chart && chart.getZr()) {
                        const zr = chart.getZr();
                        zr.off('click');
                        zr.off('mouseover');
                    }
                });
            }
        };
    }, [ref.current]);
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
        <Chart options={options} exts={[GaugeChart]} style={style} loading={loading} ref={ref} />
    );
};

const defaultOptions: EChartsOption = {
    series: [
        {
            name: 'PercentGauge',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '85%',
            splitNumber: 1,
            progress: {
                show: true,
                overlap: true,
                roundCap: true,
                width: 10,
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
                    width: 10,
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
                fontSize: 12,
                color: '#fff',
                backgroundColor: 'inherit',
                borderRadius: 3,
                offsetCenter: ['0', '100%'],
                formatter: '{value}%',
                valueAnimation: true,
            },
            data: [],
        },
    ],
};
