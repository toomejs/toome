import type { CSSProperties } from 'react';

import type * as spinners from './collection';

export type SpinnerName = keyof typeof spinners;
export type SpinnerOption<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        center?: boolean;
        style?: CSSProperties;
        speed?: number;
        color?: string;
        darkColor?: string;
        size?: string;
    },
    T
>;
export type SpinnerProps<T extends RecordAnyOrNever = RecordNever> = SpinnerOption<T> & {
    name: keyof typeof spinners;
};
export interface LoadingProps {
    component: JSX.Element;
    className?: string;
    style?: CSSProperties;
}
