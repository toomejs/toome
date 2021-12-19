import type * as echarts from 'echarts/core';
import type { GaugeSeriesOption } from 'echarts/charts';

export const cpuOptions: echarts.ComposeOption<GaugeSeriesOption> = {
    series: [
        {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            splitNumber: 12,
            itemStyle: {
                color: '#FFAB91',
            },
            progress: {
                show: true,
                width: 30,
            },

            pointer: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    width: 30,
                },
            },
            axisTick: {
                distance: -45,
                splitNumber: 5,
                lineStyle: {
                    width: 2,
                    color: '#999',
                },
            },
            splitLine: {
                distance: -52,
                length: 14,
                lineStyle: {
                    width: 3,
                    color: '#999',
                },
            },
            axisLabel: {
                distance: -20,
                color: '#999',
                fontSize: 20,
            },
            anchor: {
                show: false,
            },
            title: {
                show: false,
            },
            detail: {
                valueAnimation: true,
                width: '60%',
                lineHeight: 40,
                borderRadius: 8,
                offsetCenter: [0, '-15%'],
                fontSize: 60,
                fontWeight: 'bolder',
                formatter: '{value} °C',
            },
            data: [
                {
                    value: 20,
                },
            ],
        },
    ],
};
