import { Menu } from 'antd';

import { Link } from 'react-router-dom';

import { MenuProps } from 'antd/es/menu';

import { useCallback, useRef, useState } from 'react';

import { useDebounceFn, useUpdateEffect } from 'ahooks';

import { isString } from 'lodash-es';

import { isNil } from 'ramda';

import { MenuOption } from '@/components/Menu';
import { isUrl, useResponsive } from '@/utils';
import { ThemeMode } from '@/components/Config';
import { LayoutMenuState, useLayout } from '@/components/Layout';
import { Icon } from '@/components/Icon';

const MenuItem: FC<{ menu: MenuOption; parent?: MenuOption }> = ({ menu, parent }) => {
    if (menu.hide) return null;
    let icon: React.ReactNode | null = null;
    if (!parent && menu.icon) {
        icon = isString(menu.icon) ? (
            <Icon name={menu.icon as any} />
        ) : (
            <Icon component={menu.icon} style={{ fontSize: '0.875rem' }} />
        );
    }
    if (menu.children) {
        return (
            <Menu.SubMenu key={menu.id} title={menu.text} icon={icon}>
                {menu.children
                    .map((child) => MenuItem({ menu: child, parent: menu }))
                    .filter((child) => child !== null)}
            </Menu.SubMenu>
        );
    }
    if (!menu.path) {
        return (
            <Menu.Item key={menu.id} icon={icon}>
                <a onClick={(e) => e.preventDefault()}>{menu.text}</a>;
            </Menu.Item>
        );
    }
    if (isUrl(menu.path)) {
        return (
            <Menu.Item key={menu.id} icon={icon}>
                <a href={menu.path} target={menu.target ?? '_blank'}>
                    {menu.text}
                </a>
            </Menu.Item>
        );
    }
    return (
        <Menu.Item key={menu.id} icon={icon}>
            <Link to={menu.path}>{menu.text}</Link>
        </Menu.Item>
    );
};

export const SideMenu: FC<{
    mode?: MenuProps['mode'];
    theme: `${ThemeMode}`;
    menu: LayoutMenuState;
}> = ({ mode = 'inline', theme, menu }) => {
    const { config } = useLayout();
    const { isMobile } = useResponsive();
    const ref = useRef<string[]>(mode !== 'horizontal' ? menu.opens : []);
    const [opens, setOpens] = useState<string[] | undefined>(
        config.collapsed ? undefined : ref.current,
    );
    const { run: changeOpens } = useDebounceFn((data: string[]) => setOpens(data), {
        wait: 50,
    });
    useUpdateEffect(() => {
        if (mode === 'horizontal') return;
        if (config.collapsed) setOpens(undefined);
        else changeOpens(ref.current);
    }, [config.collapsed]);
    useUpdateEffect(() => {
        if (mode === 'horizontal') return;
        if (!config.collapsed && !isNil(opens)) ref.current = opens;
    }, [opens]);
    const onOpenChange = useCallback(
        (keys: string[]) => {
            if (mode === 'horizontal' || config.collapsed || !opens) return;
            const latest = keys.find((key) => opens.indexOf(key) === -1);
            if (latest && menu.rootSubKeys.indexOf(latest) === -1) {
                setOpens(keys);
            } else {
                setOpens(latest ? [latest] : []);
            }
        },
        [opens, mode, config.collapsed],
    );
    useUpdateEffect(() => {
        setOpens(menu.opens);
    }, [isMobile]);
    return (
        <div className="fixed-sidebar-content">
            <Menu
                inlineIndent={16}
                theme={theme}
                mode={mode}
                // defaultOpenKeys={menu.opens}
                openKeys={opens}
                selectedKeys={menu.selects}
                onOpenChange={onOpenChange}
            >
                {menu.data
                    .map((item) => MenuItem({ menu: item }))
                    .filter((child) => child !== null)}
            </Menu>
        </div>
    );
};

export const EmbedMenu: FC = () => {
    const { menu, config } = useLayout();
    return (
        <Menu theme={config.theme.sidebar} mode="inline" selectedKeys={menu.split.selects}>
            {menu.split.data
                .map((item) => MenuItem({ menu: item }))
                .filter((child) => child !== null)}
        </Menu>
    );
};
