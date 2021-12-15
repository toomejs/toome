import type { StoreApi, UseBoundStore } from 'zustand';

export type SetupByDepProps<T extends RecordAny> = {
    action: (config?: T) => void;
    config?: T;
};
export type OnceEffectProps<T extends RecordAnyOrNever> = UseBoundStore<
    { created: boolean } & T,
    StoreApi<{ created: boolean } & T>
>;
