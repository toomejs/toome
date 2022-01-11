import { useUpdateEffect } from 'ahooks';
import { omit } from 'lodash-es';
import { CSSProperties, useCallback, useState } from 'react';

import { ThemeMode, useColors, useTheme } from '../Config';

import { defaultStyle } from './constants';
import type { SpinnerOption } from './types';

export const useSpinnerStyle = <T extends RecordAnyOrNever>(props: SpinnerOption<T>) => {
    const { center, style, size, darkColor, speed } = props;
    const colors = useColors();
    const theme = useTheme();
    const [color, setColor] = useState(props.color ?? colors.info);
    const getStyle = useCallback(
        (t: `${ThemeMode}`) => ({
            ...(center ? defaultStyle : {}),
            ...omit(style ?? {}, ['className']),
            '--size': size,
            '--color': t === 'dark' ? darkColor ?? color : color,
            '--speed': speed ? `${speed}s` : undefined,
            '--darkreader-bg--color': darkColor ?? color,
            '--darkreader-border--color': darkColor ?? color,
        }),
        [],
    );
    const [styles, setStyles] = useState(getStyle(theme));
    useUpdateEffect(() => {
        setColor(props.color ?? colors.info);
    }, [colors.info, props.color]);
    useUpdateEffect(() => {
        setStyles(getStyle(theme));
    }, [theme]);
    return styles as CSSProperties;
};
