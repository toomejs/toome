import type { SpinnerOption } from '../../types';
import { useSpinnerStyle } from '../../utils';

import classes from './style.module.css';

export const Rain = (props: SpinnerOption) => {
    const style = useSpinnerStyle(props);
    return (
        <div className={classes.container} style={style}>
            {Array.from(Array(9)).map((_, index) => (
                <div key={index.toString()} />
            ))}
        </div>
    );
};
