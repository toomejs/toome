export type Role<T extends Record<string, any> = Record<string, any>> = {
    id: string;
    name: string;
} & T;
export type Permission<T extends Record<string, any> = Record<string, any>> = {
    id: string;
    name: string;
} & T;
export type User<
    T extends Record<string, any> = Record<string, any>,
    R extends Record<string, any> = Record<string, any>,
    P extends Record<string, any> = Record<string, any>,
> = {
    id: string;
    username: string;
    roles?: Role<R>[];
    permissions?: Permission<P>[];
} & T;
export type Auth = { token: null | string };
