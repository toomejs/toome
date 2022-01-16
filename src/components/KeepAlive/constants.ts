import { createContext, Dispatch } from 'react';

import { KeepAliveAction } from './types';

export enum AliveActionType {
    REMOVE = 'remove',
    ADD = 'add',
    CLEAR = 'clear',
    ACTIVE = 'ACTIVE',
}
export const KeepAliveIdContext = createContext<string | null>(null);
export const KeepAliveDispatchContext = createContext<Dispatch<KeepAliveAction> | null>(null);
