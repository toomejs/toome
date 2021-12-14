export type SetupByDepProps<T extends RecordAny> = {
    action: (config?: T) => void;
    config?: T;
};
