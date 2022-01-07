import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
} from 'echarts/components';

import type { ChartState } from './types';

export const getDefaultChartConfig = (): ChartState => ({
    render: 'canvas',
    exts: [TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent],
    height: '300px',
    width: 'auto',
});
