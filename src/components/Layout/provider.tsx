import { useLocation } from 'react-router-dom';

import { useCallback, useReducer } from 'react';

import { useUpdateEffect } from 'react-use';

import { useAntdCheck, useTheme } from '@/components/Config';

import { useMenus } from '@/components/Menu';

import { LayoutConfig } from './types';
import { getMenuData, initLayoutConfig, layoutDarkTheme, layoutReducer } from './utils';
import { useChangeLayoutLocalData, useLayoutLocalData, useSetupLayout } from './hooks';
import { LayoutActionType } from './constants';
import { LayoutContext, LayoutDispatchContext, LayoutSetup } from './store';

export const LayoutStateProvider: FC = ({ children }) => {
    const isAntd = useAntdCheck();
    const systemTheme = useTheme();
    const config = useLayoutLocalData();
    const changeConfig = useChangeLayoutLocalData();
    const menus = useMenus();
    const location = useLocation();
    const [data, dispatch] = useReducer(
        layoutReducer,
        initLayoutConfig({
            config,
            menu: getMenuData(menus, location, config.mode),
            systemTheme,
        }),
    );
    useUpdateEffect(() => {
        changeConfig((state) => ({ ...state, ...data.config }));
    }, [data.config.vars, data.config.collapsed, data.config.mode, data.config.fixed]);
    useUpdateEffect(() => {
        if (!isAntd || systemTheme !== 'dark') {
            changeConfig((state) => ({ ...state, theme: data.config.theme }));
        }
    }, [data.config.theme]);
    useUpdateEffect(() => {
        if (!isAntd) return;
        if (systemTheme === 'dark') {
            dispatch({
                type: LayoutActionType.CHANGE_THEME,
                value: layoutDarkTheme,
            });
        } else {
            dispatch({
                type: LayoutActionType.CHANGE_THEME,
                value: config.theme,
            });
        }
    }, [systemTheme]);
    useUpdateEffect(() => {
        dispatch({
            type: LayoutActionType.CHANGE_MENU,
            value: getMenuData(menus, location, data.config.mode),
        });
    }, [data.config.mode, menus, location]);
    return (
        <LayoutContext.Provider value={data}>
            <LayoutDispatchContext.Provider value={dispatch}>
                {children}
            </LayoutDispatchContext.Provider>
        </LayoutContext.Provider>
    );
};
export const LayoutProvider: FC<LayoutConfig> = ({ children, ...rest }) => {
    const setuped = LayoutSetup(useCallback((state) => state.setuped, []));
    useSetupLayout(rest);
    return setuped ? <LayoutStateProvider>{children}</LayoutStateProvider> : null;
};
