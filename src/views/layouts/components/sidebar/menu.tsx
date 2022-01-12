import { Menu } from 'antd';

import { Link } from 'react-router-dom';

import { MenuProps } from 'antd/es/menu';

import { useCallback, useRef, useState } from 'react';

import { useDebounceFn, useUpdateEffect } from 'ahooks';

import { MenuOption } from '@/components/Menu';
import { isUrl, useResponsive } from '@/utils';
import { ThemeMode } from '@/components/Config';
import { LayoutMenuState, useLayout } from '@/components/Layout';

const MenuItem: FC<{ menu: MenuOption; parent?: MenuOption }> = ({ menu, parent }) => {
    if (menu.hide) return null;
    const icon = parent ? null : menu.icon;
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
    const {
        config: { collapsed },
    } = useLayout();
    const { isMobile } = useResponsive();
    const [opens, setOpens] = useState<string[]>(
        mode !== 'horizontal' && (isMobile || !collapsed) ? menu.opens : [],
    );
    const { run: changeOpens } = useDebounceFn((data: string[]) => setOpens(data), {
        wait: 50,
    });
    const ref = useRef<string[]>(menu.opens);
    const onOpenChange = useCallback(
        (keys: string[]) => {
            if (mode === 'horizontal' || collapsed) return;
            const latest = keys.find((key) => opens.indexOf(key) === -1);
            if (latest && menu.rootSubKeys.indexOf(latest) === -1) {
                setOpens(keys);
            } else {
                setOpens(latest ? [latest] : []);
            }
        },
        [opens, mode, collapsed],
    );
    useUpdateEffect(() => {
        if (mode !== 'horizontal' && (isMobile || !collapsed)) setOpens(menu.opens);
        if (mode !== 'horizontal' && !isMobile) ref.current = menu.opens;
    }, [menu.opens]);
    useUpdateEffect(() => {
        if (mode !== 'horizontal' && !isMobile && !collapsed) ref.current = opens;
    }, [opens]);
    useUpdateEffect(() => {
        if (mode === 'horizontal' || isMobile) return;
        if (collapsed) setOpens([]);
        else changeOpens(ref.current);
    }, [collapsed]);
    useUpdateEffect(() => {
        setOpens(menu.opens);
    }, [isMobile]);
    return (
        <div className="fixed-sidebar-content">
            <Menu
                inlineIndent={16}
                theme={theme}
                mode={mode}
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
