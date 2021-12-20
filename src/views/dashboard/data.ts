import type * as echarts from 'echarts/core';
import type { GaugeSeriesOption } from 'echarts/charts';

export const cpuOptions: echarts.ComposeOption<GaugeSeriesOption> = {
    title: {
        text: '内存使用量',
    },
    series: [
        {
            name: 'Pressure',
            type: 'gauge',
            center: ['50%', '60%'],
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
                fontSize: 14,
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
                formatter: '{value}%',
            },
            data: [
                {
                    value: 0,
                    name: '内存占用',
                    title: {
                        offsetCenter: ['0', '70%'],
                    },
                    detail: {
                        offsetCenter: ['0', '95%'],
                    },
                },
            ],
        },
    ],
};

export const cputOptions: echarts.ComposeOption<GaugeSeriesOption> = {
    series: [
        {
            type: 'gauge',
            axisLine: {
                lineStyle: {
                    width: 30,
                    color: [
                        [0.3, '#67e0e3'],
                        [0.7, '#37a2da'],
                        [1, '#fd666d'],
                    ],
                },
            },
            pointer: {
                itemStyle: {},
            },
            axisTick: {
                distance: -30,
                length: 8,
                lineStyle: {
                    color: '#fff',
                    width: 2,
                },
            },
            splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                    color: '#fff',
                    width: 4,
                },
            },
            axisLabel: {
                distance: 40,
                fontSize: 20,
            },
            detail: {
                valueAnimation: true,
                formatter: '{value} km/h',
            },
            data: [
                {
                    value: 70,
                },
            ],
        },
    ],
};

export const memoryOptions = {
    series: [
        {
            type: 'liquidFill',
            data: [0.6],
            radius: '80%',
            itemStyle: {
                shadowBlur: 0,
                color: '#FFAB91',
            },
            backgroundStyle: {
                borderColor: '#E6EBF8',
                borderWidth: 1,
                shadowBlur: 0,
            },
            outline: {
                borderDistance: 0,
                itemStyle: {
                    borderWidth: 5,
                    borderColor: '#E6EBF8',
                },
            },
            label: {
                color: '#FFAB91',
            },
        },
    ],
};
