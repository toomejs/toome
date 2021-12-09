declare type RePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RePartial<U>[]
        : T[P] extends Record<string, any>
        ? RePartial<T[P]>
        : T[P];
};
declare type ReReuired<T> = {
    [P in keyof T]-?: T[P] extends (infer U)[] ? ReReuired<U>[] : ReReuired<T[P]>;
};
