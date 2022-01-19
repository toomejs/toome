import { createContext, Dispatch } from 'react';

import { KeepAliveAction } from './types';

export enum AliveActionType {
    REMOVE = 'remove',
    REMOVE_MULTI = 'remove_multi',
    ADD = 'add',
    CLEAR = 'clear',
    ACTIVE = 'active',
    CHANGE = 'change',
    RESET = 'reset',
}
export const KeepAliveIdContext = createContext<string | null>(null);
export const KeepAliveDispatchContext = createContext<Dispatch<KeepAliveAction> | null>(null);
