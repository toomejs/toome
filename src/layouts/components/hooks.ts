import { useContext, createContext, useCallback } from 'react';

import type { Dispatch, Reducer } from 'react';

import produce from 'immer';

import { LayoutFixed, LayoutMode, LayoutTheme } from '@/components/Config';

import { deepMerge, useResponsiveMobileCheck } from '@/utils';

import type { LayoutAction, LayoutState, LayoutVarsConfig } from './types';
import { LayoutActionType } from './types';
import { getLayoutFixed, getVars } from './utils';

export const LayoutContext = createContext<LayoutState | null>(null);
export const LayoutDispatchContext = createContext<Dispatch<LayoutAction> | null>(null);
export const layoutReducer: Reducer<LayoutState, LayoutAction> = produce((state, action) => {
    switch (action.type) {
        case LayoutActionType.CHANGE_VARS: {
            state.vars = getVars({ ...state.vars, ...action.vars }, action.isMobile);
            break;
        }
        case LayoutActionType.CHANGE_MODE: {
            state.mode = action.value;
            if (action.value === 'embed') state.collapsed = true;
            break;
        }
        case LayoutActionType.CHANGE_FIXED: {
            const newFixed = { [action.key]: action.value };
            state.fixed = getLayoutFixed(state.mode, { ...state.fixed, ...newFixed }, newFixed);
            break;
        }
        case LayoutActionType.CHANGE_COLLAPSE: {
            state.collapsed = action.value;
            break;
        }
        case LayoutActionType.TOGGLE_COLLAPSE: {
            state.collapsed = !state.collapsed;
            break;
        }
        case LayoutActionType.CHANGE_MOBILE_SIDE: {
            state.mobileSide = action.value;
            break;
        }
        case LayoutActionType.TOGGLE_MOBILE_SIDE: {
            state.mobileSide = !state.mobileSide;
            break;
        }
        case LayoutActionType.CHANGE_THEME: {
            state.theme = { ...state.theme, ...action.value };
            break;
        }
        case LayoutActionType.CHANGE_MENU: {
            state.menu = deepMerge(state.menu, action.value, 'replace');
            break;
        }
        default:
            break;
    }
});

export const useLayout = () => {
    const state = useContext(LayoutContext);
    if (!state) throw new Error("please wrapper the layout width 'LayoutProvider'!");
    return state;
};
export const useLayoutDispatch = () => {
    const isMobile = useResponsiveMobileCheck();
    const dispatch = useContext(LayoutDispatchContext);
    if (!dispatch) throw new Error("please wrapper the layout width 'LayoutProvider'!");
    const changeVars = useCallback(
        (vars: Required<LayoutVarsConfig>) =>
            dispatch({ type: LayoutActionType.CHANGE_VARS, vars, isMobile }),
        [],
    );
    const changeMode = useCallback(
        (mode: `${LayoutMode}`) => dispatch({ type: LayoutActionType.CHANGE_MODE, value: mode }),
        [],
    );
    const changeFixed = useCallback(
        (key: keyof LayoutFixed, value: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_FIXED, key, value }),
        [],
    );
    const changeTheme = useCallback(
        (theme: Partial<LayoutTheme>) =>
            dispatch({ type: LayoutActionType.CHANGE_THEME, value: theme }),
        [],
    );
    const changeCollapse = useCallback(
        (collapsed: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_COLLAPSE, value: collapsed }),
        [],
    );
    const toggleCollapse = useCallback(
        () => dispatch({ type: LayoutActionType.TOGGLE_COLLAPSE }),
        [],
    );
    const changeMobileSide = useCallback(
        (collapsed: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_MOBILE_SIDE, value: collapsed }),
        [],
    );
    const toggleMobileSide = useCallback(
        () => dispatch({ type: LayoutActionType.TOGGLE_MOBILE_SIDE }),
        [],
    );
    return {
        changeVars,
        changeMode,
        changeFixed,
        changeTheme,
        changeCollapse,
        toggleCollapse,
        changeMobileSide,
        toggleMobileSide,
    };
};
