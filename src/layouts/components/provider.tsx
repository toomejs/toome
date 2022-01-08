import { useLocation } from 'react-router-dom';

import { useEffect, useReducer } from 'react';

import { useUpdateEffect } from 'react-use';

import { useChangeLayoutConfig, useLayoutConfig, useTheme } from '@/components/Config';

import { useMenus } from '@/components/Menu';

import { useResponsiveMobileCheck } from '@/utils';

import { LayoutActionType, LayoutVarsConfig } from './types';
import { LayoutContext, LayoutDispatchContext, layoutReducer } from './hooks';
import { getMenuData, getVars, initLayoutConfig } from './utils';
import { defaultVars } from './default.vars';

export const LayoutProvider: FC<{ vars?: LayoutVarsConfig }> = (props) => {
    const systemTheme = useTheme();
    const config = useLayoutConfig();
    const changeConfig = useChangeLayoutConfig();
    const menus = useMenus();
    const location = useLocation();
    const isMobile = useResponsiveMobileCheck();
    const [data, dispatch] = useReducer(
        layoutReducer,
        initLayoutConfig({
            isMobile,
            config,
            menu: getMenuData(menus, location, config.mode),
            systemTheme,
            vars: getVars({ ...defaultVars, ...(props.vars ?? {}) }, isMobile),
        }),
    );
    useUpdateEffect(() => {
        dispatch({
            type: LayoutActionType.CHANGE_VARS,
            vars: { ...defaultVars, ...(props.vars ?? {}) },
            isMobile,
        });
    }, [props.vars, isMobile]);
    useUpdateEffect(() => {
        changeConfig((state) => ({ ...state, mode: data.mode }));
    }, [data.mode]);
    useUpdateEffect(() => {
        dispatch({
            type: LayoutActionType.CHANGE_MENU,
            value: getMenuData(menus, location, data.mode),
        });
    }, [data.mode, menus, location]);
    useUpdateEffect(() => {
        if (!isMobile) changeConfig((state) => ({ ...state, collapsed: data.collapsed }));
    }, [data.collapsed]);
    useUpdateEffect(() => {
        if (systemTheme !== 'dark') changeConfig((state) => ({ ...state, theme: data.theme }));
    }, [data.theme]);
    useEffect(() => {
        changeConfig((state) => ({ ...state, fixed: data.fixed }));
    }, [data.fixed]);

    return (
        <LayoutContext.Provider value={data}>
            <LayoutDispatchContext.Provider value={dispatch}>
                {props.children}
            </LayoutDispatchContext.Provider>
        </LayoutContext.Provider>
    );
};
