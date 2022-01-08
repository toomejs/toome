/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-16 05:55:08 +0800
 * @Updated_at     : 2022-01-08 12:58:01 +0800
 * @Path           : /src/utils/helpers.ts
 * @Description    : 辅助函数
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import deepmerge from 'deepmerge';

/**
 * 检测当前值是否为Promise对象
 * @param promise 待检测的值
 */
export function isPromise(promise: any): promise is PromiseLike<any> {
    return !!promise && promise instanceof Promise;
}
/**
 * 检测当前函数是否为异步函数
 * @param callback 待检测函数
 */
export function isAsyncFn<R, A extends Array<any>>(
    callback: (...asgs: A) => Promise<R> | R,
): callback is (...asgs: A) => Promise<R> {
    const AsyncFunction = (async () => {}).constructor;
    return callback instanceof AsyncFunction === true;
}
/**
 * 深度合并对象
 * @param x 初始值
 * @param y 新值
 * @param arrayMode 对于数组采取的策略,`replace`为直接替换,`merge`为合并数组
 */
export const deepMerge = <T1, T2>(
    x: Partial<T1>,
    y: Partial<T2>,
    arrayMode: 'replace' | 'merge' = 'merge',
) => {
    const options: deepmerge.Options = {};
    if (arrayMode === 'replace') {
        options.arrayMerge = (_d, s, _o) => s;
    } else if (arrayMode === 'merge') {
        options.arrayMerge = (_d, s, _o) => Array.from(new Set([..._d, ...s]));
    }
    return deepmerge(x, y, options) as T2 extends T1 ? T1 : T1 & T2;
};
/**
 * 检测当前路径是否为一个URL
 * @param path 路径(字符串)
 */
export const isUrl = (path: string): boolean => {
    if (!path.startsWith('http')) {
        return false;
    }
    try {
        const url = new URL(path);
        return !!url;
    } catch (error) {
        return false;
    }
};

/**
 *  生成一个随机浮点数
 */
export const random = () => +(Math.random() * 60).toFixed(2);
/**
 * 生成一个区间之间的随机数(含最大值，含最小值)
 * @param min 最小值
 * @param max 最大值
 */
export const randomIntFrom = (min: number, max: number) => {
    const minc = Math.ceil(min);
    const maxc = Math.floor(max);
    return Math.floor(Math.random() * (maxc - minc + 1)) + minc;
};
/**
 * 从一个数组中随机取一个值
 * @param some 待取值的数组
 */
export const randomArray = (...some: number[]) => some[randomIntFrom(0, some.length - 1)];
