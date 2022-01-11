import type { SpinnerOption } from '../../types';

import classes from './style.module.css';

export const JumpCircle = (props: SpinnerOption<{ circleColor?: string }>) => {
    const style = {
        ...useSpinnerStyle(props),
        '--circle-color': props.circleColor,
    };
    return (
        <div className={classes.container} style={style}>
            <div />
            <div />
        </div>
    );
};
