import { createContext, Dispatch } from 'react';

import { KeepAliveAction, KeepAliveContextType } from './types';

export enum AliveActionType {
    REMOVE = 'remove',
    ADD = 'add',
    CLEAR = 'clear',
    ACTIVE = 'ACTIVE',
}
export const KeepAliveContext = createContext<KeepAliveContextType | null>(null);
export const KeepAliveDispatchContext = createContext<{
    dispatch: Dispatch<KeepAliveAction>;
} | null>(null);
