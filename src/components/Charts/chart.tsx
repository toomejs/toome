import { useCallback, useEffect, useRef } from 'react';
import { useDebounceFn, useDeepCompareEffect } from 'ahooks';
import * as echarts from 'echarts/core';
import type { ECBasicOption } from 'echarts/types/dist/shared';

import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

import shallow from 'zustand/shallow';

import { pick } from 'lodash-es';

import { ChartSetuped, ChartStore } from './hooks';
import type { ChartProps, EChartExt } from './types';

export const Chart = <T extends ECBasicOption>(props: ChartProps<T>) => {
    const chart = useRef<HTMLInputElement | null>(null);
    const instance = useRef<echarts.ECharts | null>(null);
    const setuped = ChartSetuped((state) => state.setuped);
    const { run } = useDebounceFn(() => instance.current && instance.current.resize(), {
        wait: 500,
    });
    const { width, height } = ChartStore(
        useCallback((state) => ({ ...pick(state, ['width', 'height']) }), []),
        shallow,
    );
    const resize = useCallback(run, []);
    useDeepCompareEffect(() => {
        if (setuped && chart.current) {
            const exts: EChartExt[] = [
                ...ChartStore.getState().exts,
                ...(props.exts ?? []).filter((e) => !ChartStore.getState().exts.includes(e)),
            ];
            const render: 'svg' | 'canvas' = props.render ?? ChartStore.getState().render;
            echarts.use([...exts, render === 'canvas' ? CanvasRenderer : SVGRenderer]);
            const renderInstance = echarts.getInstanceByDom(chart.current);
            if (renderInstance) {
                instance.current = renderInstance;
            } else {
                instance.current = echarts.init(chart.current);
            }
            instance.current.setOption(props.options);
        }
    }, [setuped, props]);
    useEffect(() => {
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            instance.current && instance.current.dispose();
        };
    }, []);
    return (
        <div
            ref={chart}
            style={{
                width,
                height,
                ...props.style,
            }}
        />
    );
};
