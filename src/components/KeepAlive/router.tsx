export const ViewProvider = ({ value, children }: Props) => (
    <Provider value={value}>{children}</Provider>
);
