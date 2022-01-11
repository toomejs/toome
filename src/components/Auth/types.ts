/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2022-01-09 14:28:55 +0800
 * @Path           : /src/components/Auth/types.ts
 * @Description    : Auth组件类型
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
/**
 * 角色类型
 */
export type Role<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        /** 角色ID */
        id: string;
        /** 角色名称 */
        name: string;
    },
    T
>;
/**
 * 权限类型
 */
export type Permission<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        /** 权限ID */
        id: string;
        /** 权限名称 */
        name: string;
    },
    T
>;

/**
 * 用户类型
 */
export type User<
    T extends RecordAnyOrNever = RecordNever,
    R extends RecordAnyOrNever = RecordNever,
    P extends RecordAnyOrNever = RecordNever,
> = RecordScalable<
    {
        /** 角色列表 */
        roles?: Role<R>[];
        /** 权限列表 */
        permissions?: Permission<P>[];
    },
    T
>;
/**
 * 当前账户状态类型
 */
export type AuthStoreType = {
    /** 是否已经初始化Token */
    inited: boolean;
    /** Token */
    token: null | string;
    /** 用户信息 */
    user: User | null;
};
