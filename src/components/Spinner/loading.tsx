import classNames from 'classnames';

import type { LoadingProps } from './types';

export const Loading: FC<LoadingProps> = ({ className, style, component }) => {
    // 'fixed w-full h-full top-0 left-0 dark:bg-white bg-gray-800 bg-opacity-25 flex items-center justify-center';
    const defaultClassName = classNames([
        'h-full',
        'w-full',
        'flex',
        'items-center',
        'justify-center',
    ]);
    const classes = className ? `${defaultClassName} ${className}` : defaultClassName;
    return (
        <div className={classes} style={style ?? {}}>
            {component}
        </div>
    );
};
