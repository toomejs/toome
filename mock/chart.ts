import dayjs from 'dayjs';

import type { MockItem } from './types';

import { randomArray, RequestParams, resultError } from './_util';

interface TwoLineData {
    name: string;
    value: { in: string; ex: string };
}

interface TwoLineOption {
    timer: dayjs.Dayjs;
    newIndex: number;
    valueBase: { in: number; ex: number };
    waveSplit: { sm: { in: number; ex: number }; big: { in: number; ex: number } };
    values: { in: number; ex: number };
}

interface TwoLineParam {
    loop: number;
    add: { value: number; unit: string };
}
const randomLine = (base: number) =>
    Math.random() > 0.5 ? base + Math.random() : base - Math.random();
const getData = (timer: dayjs.Dayjs, values: { in: number; ex: number }): TwoLineData => ({
    name: timer.format(),
    value: { in: values.in.toFixed(2), ex: values.ex.toFixed(2) },
});

const getArrayRedom = () => randomArray(10, 21, 3, 6);

const networkOptions: Record<string, TwoLineOption> = {};
const ioOptions: Record<string, TwoLineOption> = {};
const setTwoLineSplit = (index: number, option: TwoLineOption) => {
    if (index % option.waveSplit.big.in === 0) {
        option.valueBase.in = getArrayRedom();
    }
    if (index % option.waveSplit.big.ex === 0) {
        option.valueBase.ex = getArrayRedom();
    }
    if (index % option.waveSplit.sm.in === 0) {
        option.values.in = randomLine(option.valueBase.in);
    }
    if (index % option.waveSplit.sm.ex === 0) {
        option.values.ex = randomLine(option.valueBase.ex);
    }
};
const createTwoLineData = (option: TwoLineOption, params: TwoLineParam) => {
    option.values = {
        in: randomLine(option.waveSplit.big.in),
        ex: randomLine(option.waveSplit.big.ex),
    };
    const data: TwoLineData[] = [];
    for (let i = 0; i < params.loop; i++) {
        option.timer = option.timer.add(params.add.value, params.add.unit);
        setTwoLineSplit(i, option);
        data.push(getData(option.timer, option.values));
    }
    return data;
};

const newTwoLineData = (option: TwoLineOption, params: TwoLineParam) => {
    for (let i = 0; i < params.loop; i++) {
        option.timer = option.timer ? option.timer.add(params.add.value, params.add.unit) : dayjs();
        option.newIndex++;
        setTwoLineSplit(option.newIndex, option);
    }
    return [getData(option.timer, option.values)];
};

export default [
    {
        url: '/api/chart/network',
        method: 'get',
        response(request: RequestParams) {
            const id = request.query?.id;
            if (!id) {
                this.res.statusCode = 500;
                return resultError('must specify id!');
            }
            const inited = JSON.parse((request.query?.inited ?? 'false').toLowerCase());
            if (!inited) {
                networkOptions[id] = {
                    timer: dayjs().subtract(1, 'h'),
                    newIndex: 0,
                    valueBase: { in: getArrayRedom(), ex: getArrayRedom() },
                    values: { in: 0, ex: 0 },
                    waveSplit: { sm: { in: 10, ex: 90 }, big: { in: 600, ex: 1200 } },
                };
                return createTwoLineData(networkOptions[id], {
                    loop: 3600,
                    add: { value: 1, unit: 's' },
                });
            }
            return newTwoLineData(networkOptions[id], {
                loop: 3,
                add: { value: 1, unit: 's' },
            });
        },
    },
    {
        url: '/api/chart/io',
        method: 'get',
        response(request: RequestParams) {
            const id = request.query?.id;
            if (!id) {
                this.res.statusCode = 500;
                return resultError('must specify id!');
            }
            const inited = JSON.parse((request.query?.inited ?? 'false').toLowerCase());
            if (!inited) {
                ioOptions[id] = {
                    timer: dayjs().subtract(10, 'm'),
                    newIndex: 0,
                    valueBase: { in: getArrayRedom(), ex: getArrayRedom() },
                    values: { in: 0, ex: 0 },
                    waveSplit: { sm: { in: 3, ex: 5 }, big: { in: 60, ex: 100 } },
                };
                return createTwoLineData(ioOptions[id], {
                    loop: 600,
                    add: { value: 1, unit: 's' },
                });
            }
            return newTwoLineData(ioOptions[id], {
                loop: 1,
                add: { value: 1, unit: 's' },
            });
        },
    },
] as MockItem[];
