import type { State, StoreApi, UseBoundStore } from 'zustand';
import type { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

import type { ZSImmberSelectorStoreApi, ZSImmberUseBoundStore } from '@/utils/types';

export type SetupByDepProps<T extends RecordAny> = {
    action: (config?: T) => void;
    config?: T;
};
export type SetupedEffectStore<T extends RecordAnyOrNever> = UseBoundStore<
    { created: boolean; setuped: boolean } & T,
    StoreApi<{ created: boolean; setuped: boolean } & T>
>;

export type SetupedEffectProps<T extends RecordAnyOrNever> = {
    store: UseBoundStore<
        { created: boolean; setuped: boolean } & T,
        StoreApi<{ created: boolean; setuped: boolean } & T>
    >;
    callback: () => void | Promise<void>;
    clear?: () => any;
    wait?: number;
};
export type SubsciberDebounceStore<T extends State> =
    | UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>>
    | ZSImmberUseBoundStore<T, ZSImmberSelectorStoreApi<T>>;
export type SubsciberDebounceProps<T extends State, K extends keyof T> = {
    store: SubsciberDebounceStore<T>;
    select: string;
    callback: (current: T[K], pre?: T[K]) => void | Promise<void>;
    wait?: number;
};
