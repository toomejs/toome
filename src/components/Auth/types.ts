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
