import type { SpinnerOption } from '../../types';
import { getStyle } from '../../utils';

import classes from './style.module.css';

export const Eat = (props: SpinnerOption<{ itemColor?: string }>) => {
    const style = {
        ...getStyle(props),
        '--item-color': props.itemColor,
    };
    return (
        <div className={classes.container} style={style}>
            <div>
                <div />
                <div />
                <div />
            </div>
            <div>
                <div />
                <div />
                <div />
            </div>
        </div>
    );
};
