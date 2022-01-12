import { Divider, Drawer, Switch, Tooltip } from 'antd';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

import produce from 'immer';
import { SketchPicker, ColorResult } from 'react-color';

import { useColorDispatch, useColors, ColorConfig } from '@/components/Config';

import { useLayout, useLayoutDispatch } from '@/components/Layout';

import style from './index.module.less';

import { ColorList, LayoutModeList, LayoutTheme, LayoutThemeList } from './constants';

import { ChangeDrawerContext, DrawerContext, useDrawer, useDrawerChange } from './hooks';

const LayoutSetting = () => {
    const { changeMode } = useLayoutDispatch();
    return (
        <div className={style.layoutMode}>
            {LayoutModeList.map((item, index) => (
                <Tooltip title={item.title} placement="bottom" key={index.toString()}>
                    <div
                        className={classNames(['item', item.type])}
                        onClick={() => changeMode(item.type)}
                    >
                        {item.type === 'embed' ? <div className="content-sidebar" /> : null}
                    </div>
                </Tooltip>
            ))}
        </div>
    );
};

const ThemeSetting = () => {
    const { changeTheme: changeLayoutTheme } = useLayoutDispatch();
    const changeTheme = useCallback((type: `${LayoutTheme}`) => {
        const theme = type.split('-') as Array<'light' | 'dark'>;
        if (theme.length === 2) {
            changeLayoutTheme({
                header: theme[1],
                sidebar: theme[0],
            });
        }
    }, []);
    return (
        <div className={style.layoutTheme}>
            {LayoutThemeList.map((item, index) => (
                <Tooltip title={item.title} placement="bottom" key={index.toString()}>
                    <div
                        className={classNames(['item', item.type])}
                        onClick={() => changeTheme(item.type)}
                    />
                </Tooltip>
            ))}
        </div>
    );
};

const ColorSetting = () => {
    const colors = useColors();
    const { changeColor } = useColorDispatch();
    const [display, setDisplay] = useState<{ [key in NonNullable<keyof ColorConfig>]: boolean }>({
        primary: false,
        info: false,
        success: false,
        warning: false,
        error: false,
    });
    const closePickers = useCallback(() => {
        setDisplay(
            produce((state) => {
                Object.keys(state).forEach((key) => {
                    state[key] = false;
                });
            }),
        );
    }, []);
    const togglePicker = useCallback((picker: keyof ColorConfig) => {
        closePickers();
        setDisplay(
            produce((state) => {
                state[picker] = !state[picker];
            }),
        );
    }, []);
    const changeAppColor = useCallback((color: ColorResult['rgb'], type: keyof ColorConfig) => {
        const rgba = `rgba(${color.r},${color.g},${color.b},${color.a ?? 1})`;
        changeColor(type, rgba);
    }, []);
    return (
        <div className={style.colorSetting}>
            {ColorList.map((item, index) => (
                <Tooltip title={item.title} placement="bottom" key={index.toString()}>
                    <div className="item">
                        <div className="swatch" onClick={() => togglePicker(item.type)}>
                            <div
                                className="swatch-color"
                                style={{ backgroundColor: colors[item.type] }}
                            />
                        </div>
                        {display[item.type] ? (
                            <div className="picker-popover">
                                <div className="picker-cover" onClick={closePickers} />
                                <SketchPicker
                                    color={colors[item.type]}
                                    onChangeComplete={(color) =>
                                        changeAppColor(color.rgb, item.type)
                                    }
                                />
                            </div>
                        ) : null}
                    </div>
                </Tooltip>
            ))}
        </div>
    );
};

const Feature: FC = () => {
    const {
        config: { mode, fixed, collapsed },
    } = useLayout();
    const { changeFixed, changeCollapse } = useLayoutDispatch();
    return (
        <>
            <div className="flex justify-between mb-2">
                <span>固定顶栏</span>
                <Switch
                    checked={fixed.header}
                    onChange={(checked) => changeFixed('header', checked)}
                />
            </div>
            <div className="flex justify-between my-2">
                <span>固定侧边栏</span>
                <Switch
                    checked={fixed.sidebar}
                    onChange={(checked) => changeFixed('sidebar', checked)}
                />
            </div>

            {mode === 'embed' ? (
                <div className="flex justify-between my-2">
                    <span>固定子侧边栏</span>
                    <Switch
                        checked={fixed.embed}
                        onChange={(checked) => changeFixed('embed', checked)}
                    />
                </div>
            ) : null}

            <div className="flex justify-between mb-2">
                <span>折叠边栏</span>
                <Switch checked={collapsed} onChange={(checked) => changeCollapse(checked)} />
            </div>
        </>
    );
};

const DrawerProvider: FC = ({ children }) => {
    const [show, changeShow] = useState(false);
    const changeStatus = useCallback(changeShow, []);
    return (
        <DrawerContext.Provider value={show}>
            <ChangeDrawerContext.Provider value={changeStatus}>
                {children}
            </ChangeDrawerContext.Provider>
        </DrawerContext.Provider>
    );
};

const DrawerView: FC = () => {
    const visible = useDrawer();
    const changeVisible = useDrawerChange();
    return (
        <Drawer
            title="界面设置"
            placement="right"
            size="default"
            onClose={() => changeVisible(false)}
            visible={visible}
        >
            <Divider>布局</Divider>
            <LayoutSetting />
            <Divider>风格</Divider>
            <ThemeSetting />
            <Divider>颜色</Divider>
            <ColorSetting />
            <Divider>功能</Divider>
            <Feature />
        </Drawer>
    );
};
export const ConfigDrawer: FC = ({ children }) => (
    <DrawerProvider>
        {children}
        <DrawerView />
    </DrawerProvider>
);
