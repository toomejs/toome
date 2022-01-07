import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { useDebounceFn, useDeepCompareEffect, useUpdateEffect } from 'ahooks';
import * as echarts from 'echarts/core';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import shallow from 'zustand/shallow';

import { omit, pick } from 'lodash-es';

import { ConfigSetup, ConfigStore, useTheme } from '../Config';

import type { ChartProps, EChartExt } from './types';
import { ChartSetup, ChartStore } from './store';

export interface ParentRef {
    dispatch: (action: (chart: echarts.ECharts | null) => void) => void;
}
export const Chart = forwardRef<ParentRef | null, ChartProps<ECBasicOption & RecordAny>>(
    ({ className, style, options, render, exts = [], loading = {} }, ref) => {
        const chartSetuped = ChartSetup((state) => state.setuped);
        const themeSetuped = ConfigSetup((state) => state.setuped);
        const theme = useTheme();
        const dom = useRef<HTMLInputElement | null>(null);
        const chart = useRef<echarts.ECharts | null>(null);
        const { width, height } = ChartStore(
            useCallback((state) => ({ ...pick(state, ['width', 'height']) }), []),
            shallow,
        );
        const { run: resize } = useDebounceFn(
            () => chart.current && !chart.current.isDisposed() && chart.current.resize(),
            {
                wait: 500,
            },
        );
        const updateLoading = useCallback(() => {
            if (chart.current && !chart.current.isDisposed()) {
                if (typeof loading.show === 'boolean') {
                    loading.show
                        ? chart.current.showLoading(
                              loading.type ?? 'default',
                              omit(loading, ['type', 'show']),
                          )
                        : chart.current.hideLoading();
                }
            }
        }, [loading]);
        useEffect(() => {
            window.addEventListener('resize', resize);
            return () => {
                window.removeEventListener('resize', resize);
                chart.current && chart.current.dispose();
            };
        }, []);
        const createChart = useCallback(() => {
            // const renderInstance = echarts.getInstanceByDom(chart.current);
            if (!dom.current) return;
            const themeMode = ConfigStore.getState().config.theme.mode;
            if (!chart.current) {
                const extensions: EChartExt[] = [
                    ...ChartStore.getState().exts,
                    ...(exts ?? []).filter((e) => !ChartStore.getState().exts.includes(e)),
                ];
                const chartRender: 'svg' | 'canvas' = render ?? ChartStore.getState().render;
                echarts.use([
                    ...extensions,
                    chartRender === 'canvas' ? CanvasRenderer : SVGRenderer,
                ]);
            } else if (!chart.current.isDisposed()) {
                chart.current.dispose();
            }
            chart.current = echarts.init(dom.current, themeMode === 'dark' ? themeMode : undefined);
            chart.current.setOption({
                backgroundColor: 'transparent',
                ...options,
            });
            updateLoading();
        }, []);
        useEffect(() => {
            if (themeSetuped && chartSetuped) createChart();
        }, [chartSetuped, themeSetuped]);
        useUpdateEffect(() => {
            createChart();
        }, [theme]);
        useDeepCompareEffect(() => {
            if (chart.current && !chart.current.isDisposed()) {
                chart.current.setOption(options);
            }
        }, [options]);
        useUpdateEffect(() => {
            updateLoading();
        }, [loading]);
        useImperativeHandle(
            ref,
            () => ({
                dispatch: (action) => {
                    action(chart.current && !chart.current.isDisposed() ? chart.current : null);
                },
            }),
            [],
        );
        return (
            <div
                ref={dom}
                className={className}
                style={{
                    width,
                    height,
                    ...style,
                }}
            />
        );
    },
);
