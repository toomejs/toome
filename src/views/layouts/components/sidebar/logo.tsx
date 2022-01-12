import { CSSProperties } from 'react';

export const Logo: FC<{ style?: CSSProperties }> = ({ style }) => {
    return <div className="h-[36px] m-[16px] bg-[rgb(255 255 255 / 20%)]" style={style ?? {}} />;
};
