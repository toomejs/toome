import { useLocation } from 'react-router-dom';

import { useReducer } from 'react';

import { useUpdateEffect } from 'react-use';

import {
    LayoutComponent,
    useLayoutConfig,
    useLayoutConfigDispatch,
    useTheme,
} from '@/components/Config';

import { useMenus } from '@/components/Menu';

import { useResponsiveMobileCheck } from '@/utils/device';

import { LayoutActionType, LayoutVarsConfig } from './types';
import { LayoutContext, LayoutDispatchContext, layoutReducer } from './hooks';
import { getMenuData, initLayoutConfig } from './utils';
import { defaultVars } from './default.vars';

export const LayoutProvider: FC<{ vars?: LayoutVarsConfig }> = (props) => {
    const systemTheme = useTheme();
    const config = useLayoutConfig();
    const menus = useMenus();
    const location = useLocation();
    const isMobile = useResponsiveMobileCheck();
    const { changeCollapse, changeLayoutTheme, changeFixed } = useLayoutConfigDispatch();
    const [data, dispatch] = useReducer(
        layoutReducer,
        initLayoutConfig({
            isMobile,
            config,
            menu: getMenuData(menus, location, config.mode),
            systemTheme,
            vars: { ...defaultVars, ...(props.vars ?? {}) },
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
        dispatch({
            type: LayoutActionType.CHANGE_MENU,
            value: getMenuData(menus, location, data.mode),
        });
    }, [data.mode, menus, location]);
    useUpdateEffect(() => {
        if (!isMobile) changeCollapse(data.collapsed);
    }, [data.collapsed]);
    useUpdateEffect(() => {
        if (systemTheme !== 'dark') changeLayoutTheme(data.theme);
    }, [data.theme]);
    useUpdateEffect(() => {
        Object.keys(data.fixed).forEach((key) =>
            changeFixed(key as LayoutComponent, data.fixed[key]),
        );
    }, [data.fixed]);

    return (
        <LayoutContext.Provider value={data}>
            <LayoutDispatchContext.Provider value={dispatch}>
                {props.children}
            </LayoutDispatchContext.Provider>
        </LayoutContext.Provider>
    );
};
