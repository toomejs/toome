import type * as echarts from 'echarts/core';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import type { CSSProperties } from 'react';
import type { GaugeSeriesOption } from 'echarts/charts';

export type EChartExt = ArrayItem<Filter<Parameters<typeof echarts.use>[0], Array<any>>>;
export interface ChartConfig {
    render?: 'svg' | 'canvas';
    exts?: Array<EChartExt>;
    height?: string;
    width?: string;
}
export interface ChartState extends Required<ChartConfig> {}
export interface ChartProps<T extends ECBasicOption> extends ChartConfig {
    options: T;
    className?: string;
    style?: CSSProperties;
    create?: (inc?: echarts.ECharts) => void;
}
export type GaugeChartProps = {
    config?: Omit<GaugeSeriesOption, 'data'> & {
        click?: (chart: echarts.ECharts) => void;
    };
    style?: CSSProperties;
    data: NonNullable<GaugeSeriesOption['data']>;
};
