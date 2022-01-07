import type { SpinnerOption } from '../../types';
import { getStyle } from '../../utils';

import classes from './style.module.css';

export const Box = (props: SpinnerOption) => {
    const style = getStyle(props);
    return <div className={classes.container} style={style} />;
};
