import type { CSSProperties } from 'react';

export const Logo: FC<{ style?: CSSProperties }> = ({ style }) => {
    return <div className="logo" style={style ?? {}} />;
};
