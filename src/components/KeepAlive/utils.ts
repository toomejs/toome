import produce from 'immer';
import { equals, find, findIndex } from 'ramda';
import { Reducer } from 'react';

import { RouteNavigator } from '../Router';

import { AliveActionType } from './constants';

import { KeepAliveAction, KeepAliveStoreType } from './types';

export const keepAliveReducer: Reducer<KeepAliveStoreType, KeepAliveAction> = produce(
    (state, action) => {
        switch (action.type) {
            case AliveActionType.ADD:
                add(state, action.id);
                break;
            case AliveActionType.REMOVE:
                remove(state, action.params);
                break;
            case AliveActionType.CLEAR:
                clear(state, action.navigate);
                break;
            case AliveActionType.ACTIVE:
                changeActive(state, action.id);
                break;
            case AliveActionType.CHANGE:
                changeTab(state, action.params);
                break;
            default:
                break;
        }
    },
);

const add = (state: KeepAliveStoreType, id: string) => {
    const lives = [...state.lives];
    if (lives.some((item) => item === id && state.active === id)) return;
    const isNew = lives.filter((item) => item === id).length < 1;
    if (isNew) {
        if (lives.length >= state.maxLen) state.lives.shift();
        state.lives.push(id);
        state.active = id;
    }
};

const remove = (
    state: KeepAliveStoreType,
    params: {
        id: string;
        navigate: RouteNavigator;
    },
) => {
    const { id, navigate } = params;
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
};

const changeActive = (state: KeepAliveStoreType, id: string) => {
    const current = find((item) => item === id, state.lives);
    if (current && state.active !== current) state.active = current;
};
const changeTab = (
    state: KeepAliveStoreType,
    params: {
        id: string;
        navigate: RouteNavigator;
    },
) => {
    const current = find((item) => item === params.id, state.lives);
    if (!current || state.active === params.id) return;
    params.navigate({ id: params.id });
};
const clear = (state: KeepAliveStoreType, navigate: RouteNavigator) => {
    if (state.active) state.lives = [state.active];
    navigate({ pathname: '/' });
};
