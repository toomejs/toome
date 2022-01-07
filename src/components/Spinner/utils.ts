import { omit } from 'lodash-es';
import type { CSSProperties } from 'react';

import { defaultStyle } from './constants';
import type { SpinnerOption } from './types';

export const getStyle = <T extends RecordAnyOrNever>({
    style,
    size,
    color,
    speed,
}: SpinnerOption<T>) =>
    ({
        ...defaultStyle,
        ...omit(style ?? {}, ['className']),
        '--size': size,
        '--color': color,
        '--speed': speed ? `${speed}s` : undefined,
    } as CSSProperties);
