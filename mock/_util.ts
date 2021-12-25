// Interface data format used to return a unified format
export function resultItems<T = Record<string, any>>(data: T, meta: Record<string, any> = {}) {
    return {
        data,
        meta,
    };
}

export function resultSuccess<T = Record<string, any>>(result: T, { message = 'ok' } = {}) {
    return {
        code: 0,
        result,
        message,
        type: 'success',
    };
}

export function resultPageSuccess<T = any>(
    page: number,
    pageSize: number,
    list: T[],
    { message = 'ok' } = {},
) {
    const pageData = pagination(page, pageSize, list);

    return {
        ...resultSuccess({
            items: pageData,
            total: list.length,
        }),
        message,
    };
}

export function resultError(message = 'Request failed', { code = -1, result = null } = {}) {
    return {
        code,
        result,
        message,
        type: 'error',
    };
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
    const offset = (pageNo - 1) * Number(pageSize);
    const ret =
        offset + Number(pageSize) >= array.length
            ? array.slice(offset, array.length)
            : array.slice(offset, offset + Number(pageSize));
    return ret;
}

export interface RequestParams {
    method: string;
    body: any;
    headers?: { authorization?: string };
    query: any;
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: RequestParams): string | undefined {
    return headers?.authorization;
}

export const randomIntFrom = (min: number, max: number) => {
    const minc = Math.ceil(min);
    const maxc = Math.floor(max);
    return Math.floor(Math.random() * (maxc - minc + 1)) + minc; // 含最大值，含最小值
};
export const randomArray = (...some: number[]) => some[randomIntFrom(0, some.length - 1)];
