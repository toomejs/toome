import { createContext, Dispatch } from 'react';

import { KeepAliveAction } from './types';

export enum AliveActionType {
    REMOVE = 'remove',
    ADD = 'add',
    CLEAR = 'clear',
    ACTIVE = 'active',
    CHANGE = 'change',
}
export const KeepAliveIdContext = createContext<string | null>(null);
export const KeepAliveDispatchContext = createContext<Dispatch<KeepAliveAction> | null>(null);
