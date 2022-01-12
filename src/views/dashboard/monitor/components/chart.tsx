import { useEffect, useMemo, useState } from 'react';

import { PercentGaugeChart } from '@/components/Chart';

import { random } from '@/utils';

import { useServer } from './data';

export const CpuMonitor = () => {
    const { server, loading } = useServer('1');
    const num = useMemo(() => server?.cpu, [server?.cpu]);
    const [value, setValue] = useState<number>(0);
    useEffect(() => {
        if (server) setValue(random());
        const clear = setInterval(() => {
            if (server) setValue(random());
        }, 5000);
        return () => clearInterval(clear);
    }, [server]);
    return (
        <PercentGaugeChart
            config={{
                startAngle: 90,
                endAngle: -270,
                pointer: {
                    show: false,
                },
                itemStyle: {
                    color: '#ffcc00',
                },
                title: { offsetCenter: ['0', '-5%'] },
                detail: {
                    fontSize: 10,
                    width: 60,
                    padding: 1,
                    valueAnimation: true,
                    offsetCenter: ['0%', '20%'],
                },
            }}
            data={[{ name: `CPU / ${num}核`, value }]}
            style={{ height: '150px' }}
            loading={{ show: loading }}
        />
    );
};
