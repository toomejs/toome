export type Role<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        id: string;
        name: string;
    },
    T
>;
export type Permission<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        id: string;
        name: string;
    },
    T
>;

export type User<
    T extends RecordAnyOrNever = RecordNever,
    R extends RecordAnyOrNever = RecordNever,
    P extends RecordAnyOrNever = RecordNever,
> = RecordScalable<
    {
        roles?: Role<R>[];
        permissions?: Permission<P>[];
    },
    T
>;
export type AuthStore = { inited: boolean; token: null | string; user: User | null };
