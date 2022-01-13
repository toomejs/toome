import { createContext } from 'react';

import { KeepAliveContextType } from './types';

export enum KeepAliveActionType {
    del = 'DEL',
    add = 'ADD',
    update = 'UPDATE',
    clear = 'CLEAR',
}
export const KeepAliveContext = createContext<KeepAliveContextType>({});
