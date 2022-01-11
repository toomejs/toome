import type { SpinnerOption } from '../../types';
import { useSpinnerStyle } from '../../utils';

import classes from './style.module.css';

export const Eat = (props: SpinnerOption<{ itemColor?: string }>) => {
    const style = {
        ...useSpinnerStyle(props),
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
