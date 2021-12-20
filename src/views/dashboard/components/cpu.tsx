export const CpuReader: FC = () => {
    const value = useMemo(() => random(), []);
    return (
        <PercentGaugeChart
            config={{ name: 'CPU / 4核' }}
            value={value}
            style={{ height: '200px' }}
        />
    );
};
