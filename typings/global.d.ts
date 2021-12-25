/* eslint-disable @typescript-eslint/ban-types */
/**
 * 获取数组中元素的类型
 */
declare type ArrayItem<A> = A extends readonly (infer T)[] ? T : never;
/**
 * 过滤类型,去除U中T不包含的类型
 */
declare type Filter<T, U> = T extends U ? T : never;

/**
 * 反向过滤类型,去除U中T包含的类型
 */
declare type Diff<T, U> = T extends U ? never : T;

/**
 * 获取一个对象的值类型
 */
declare type ValueOf<T> = T[keyof T];
/**
 * React组件简写
 */
declare type FC<P = {}> = React.FunctionComponent<P>;
/**
 * 获取一个React组件的props类型
 */
declare type ReactProps<T> = T extends FC<infer C> ? C : never;

declare type RePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] | undefined
        ? RePartial<U>[]
        : T[P] extends object | undefined
        ? T[P] extends ((...args: any[]) => any) | ClassType<T[P]> | undefined
            ? T[P]
            : RePartial<T[P]>
        : T[P];
};
declare type ReRequired<T> = {
    [P in keyof T]-?: T[P] extends (infer U)[] | undefined
        ? ReRequired<U>[]
        : T[P] extends object | undefined
        ? T[P] extends ((...args: any[]) => any) | ClassType<T[P]> | undefined
            ? T[P]
            : ReRequired<T[P]>
        : T[P];
};
declare type RecordAny = Record<string, any>;
declare type RecordNever = Record<never, never>;
declare type RecordAnyOrNever = RecordAny | RecordNever;
declare type RecordScalable<T extends RecordAny, U extends RecordAnyOrNever> = T &
    (U extends Record<string, never> ? RecordNever : U);
/**
 * 一个类的类型
 */
declare type ClassInstanceType<T extends abstract new (...args: any) => any> =
    T extends abstract new (...args: any) => infer R ? R : never;
declare type ClassType<T> = { new (...args: any[]): T };
declare type ObjectType<T> = ClassType<T> | ((...args: any[]) => any);
//  type ClassInstanceType<T> = T extends { new (...args: any[]): infer U } ? U : never;
