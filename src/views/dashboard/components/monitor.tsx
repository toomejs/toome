import { useCallback, useEffect, useState } from 'react';

import { useDebounceFn } from 'ahooks';

import type { GaugeSeriesOption } from 'echarts/charts';

import { PercentGaugeChart } from '@/components/Charts';

import { random, randomIntFrom } from '../utils';

export const MemoryMonitor = () => {
    const [data, setData] = useState<NonNullable<GaugeSeriesOption['data']>>([
        {
            name: '内存(点击优化)',
            value: 0,
        },
    ]);
    const changeData = useCallback((v: number) => {
        setData(data.map((item) => ({ ...(item as any), value: v })));
    }, []);
    const maxRand = 1024 * randomIntFrom(1, 4);
    const getPercent = useCallback(() => Math.random() * (maxRand - 1) + 1, []);
    const [max, setMax] = useState<number>(0);
    const { run } = useDebounceFn(
        (reset = false) => {
            if (reset) changeData(0);
            setTimeout(() => changeData(getPercent()), 500);
        },
        { leading: true },
    );
    useEffect(() => {
        setTimeout(() => {
            setMax(maxRand);
            run();
        }, 500);
        const clear = setInterval(() => run(), 4500);
        return () => clearInterval(clear);
    }, []);
    const change = useCallback(() => run(true), []);
    return max > 0 ? (
        <PercentGaugeChart
            config={{
                click: change,
                min: 0,
                max,
                axisLabel: {
                    show: true,
                    distance: 20,
                    // color: 'inherit',
                },
                splitLine: {
                    show: true,
                    distance: -30,
                    length: 30,
                    lineStyle: {
                        color: '#fff',
                        width: 4,
                    },
                },
                detail: {
                    width: 180,
                    formatter: (value) => {
                        const percent = `${((value / max) * 100).toFixed(2)}%`;
                        return `已用[${Math.ceil(value)}/MB,${percent}]`;
                    },
                },
            }}
            data={data}
            style={{ height: '200px' }}
        />
    ) : null;
};

export const CpuMonitor = () => {
    const [data, setData] = useState<NonNullable<GaugeSeriesOption['data']>>([
        {
            name: 'CPU / 4核',
            value: 0,
        },
    ]);
    const changeData = useCallback((v: number) => {
        setData(data.map((item) => ({ ...(item as any), value: v })));
    }, []);
    useEffect(() => {
        changeData(random());
        const clear = setInterval(() => changeData(random()), 5500);
        return () => clearInterval(clear);
    }, []);
    return <PercentGaugeChart data={data} style={{ height: '200px' }} />;
};

export const DiskMonitor = () => {
    const [data, setData] = useState<NonNullable<GaugeSeriesOption['data']>>([
        {
            name: '磁盘使用率',
            value: 0,
        },
    ]);
    const changeData = useCallback((v: number) => {
        setData(data.map((item) => ({ ...(item as any), value: v })));
    }, []);
    const maxRand = randomArray(100, 1024);
    const getPercent = useCallback(() => Math.random() * (maxRand - 1) + 1, []);
    const [max, setMax] = useState<number>(0);
    useEffect(() => {
        setTimeout(() => {
            setMax(maxRand);
            setTimeout(() => changeData(getPercent()), 500);
        }, 500);
    }, []);
    return max > 0 ? (
        <PercentGaugeChart
            config={{
                min: 0,
                max,
                axisLabel: {
                    show: true,
                    distance: 20,
                    // color: 'inherit',
                },
                splitLine: {
                    show: true,
                    distance: -30,
                    length: 30,
                    lineStyle: {
                        color: '#fff',
                        width: 4,
                    },
                },
                detail: {
                    width: 180,
                    formatter: (value) => {
                        const percent = `${((value / max) * 100).toFixed(2)}%`;
                        return `已用[${Math.ceil(value)}/GB,${percent}]`;
                    },
                },
            }}
            data={data}
            style={{ height: '200px' }}
        />
    ) : null;
};

// export const NetLoadMonitor = () => {
//     const [value, setValue] = useState<number>(0);
//     useAsyncEffect(async () => {
//         setTimeout(() => setValue(random()), 500);
//     }, []);
//     return (
//         <PercentGaugeChart
//             config={{ name: '磁盘使用率' }}
//             value={value}
//             style={{ height: '200px' }}
//         />
//     );
// };
