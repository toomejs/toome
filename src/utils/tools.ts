import type deepmerge from 'deepmerge';
import deepmergeDo from 'deepmerge';

export function isPromise(promise: any): promise is PromiseLike<any> {
    return !!promise && promise instanceof Promise;
}
export function isAsyncFn<R, A extends Array<any>>(
    callback: (...asgs: A) => Promise<R> | R,
): callback is (...asgs: A) => Promise<R> {
    const AsyncFunction = (async () => {}).constructor;
    return callback instanceof AsyncFunction === true;
}
export const deepMerge = <T1, T2>(x: Partial<T1>, y: Partial<T2>, options?: deepmerge.Options) => {
    return deepmergeDo(
        x,
        y,
        options ?? { arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])) },
    ) as T2 extends T1 ? T1 : T1 & T2;
};

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
