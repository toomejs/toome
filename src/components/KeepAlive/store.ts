import produce from 'immer';
import { equals, filter, find, findIndex, includes, isNil, not } from 'ramda';
import { Reducer } from 'react';

import { createReduxStore, createStore } from '@/utils';

import { AliveActionType } from './constants';

import { KeepAliveAction, KeepAliveStoreType } from './types';

const keepAliveReducer: Reducer<KeepAliveStoreType, KeepAliveAction> = produce((state, action) => {
    switch (action.type) {
        case AliveActionType.ADD: {
            const lives = [...state.lives];
            if (lives.some((item) => item === action.id && state.active === action.id)) return;
            const isNew = lives.filter((item) => item === action.id).length < 1;
            if (isNew) {
                if (lives.length >= state.maxLen) state.lives.shift();
                state.lives.push(action.id);
                state.active = action.id;
            }
            break;
        }
        case AliveActionType.REMOVE: {
            const { id, navigate } = action.params;
            const index = findIndex((item) => item === id, state.lives);
            if (equals(index, -1)) return;
            const toRemove = state.lives[index];
            state.lives.splice(index, 1);
            if (state.active === toRemove) {
                if (state.lives.length < 1) {
                    navigate(state.path);
                } else {
                    const toActiveIndex = index > 0 ? index - 1 : index;
                    state.active = state.lives[toActiveIndex];
                    navigate({ id: state.active });
                }
            }
            break;
        }
        case AliveActionType.REMOVE_MULTI: {
            const { ids, navigate } = action.params;
            state.lives = filter((item) => not(includes(item, ids)), state.lives);
            if (state.lives.length < 1) navigate(state.path);
            break;
        }
        case AliveActionType.CLEAR: {
            state.lives = [];
            action.navigate(state.path);
            break;
        }
        case AliveActionType.ACTIVE: {
            const current = find((item) => item === action.id, state.lives);
            if (current && state.active !== current) state.active = current;
            break;
        }
        case AliveActionType.CHANGE: {
            const { id, navigate } = action.params;
            const current = find((item) => item === id, state.lives);
            if (!current || state.active === id) return;
            navigate({ id });
            break;
        }
        case AliveActionType.RESET: {
            const { id, navigate } = action.params;
            state.reset = id;
            if (!isNil(id) && navigate) navigate({ id });
            break;
        }
        default:
            break;
    }
});

export const KeepAliveSetup = createStore<{ setuped?: true; generated?: true }>(() => ({}));

export const KeepAliveStore = createReduxStore(keepAliveReducer, {
    path: '/',
    active: null,
    include: [],
    exclude: [],
    maxLen: 10,
    notFound: '/errors/404',
    lives: [],
    reset: null,
});
