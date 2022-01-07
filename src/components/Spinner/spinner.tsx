import type { SpinnerProps } from './types';
import * as spinners from './collection';

export const Spinner: FC<SpinnerProps> = ({ name, ...rest }) => {
    const Icon = spinners[name];
    return Icon ? <Icon {...rest} /> : null;
};
