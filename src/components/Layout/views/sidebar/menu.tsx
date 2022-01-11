import { Menu } from 'antd';

import { Link } from 'react-router-dom';

import { MenuProps } from 'antd/es/menu';

import { useCallback, useMemo, useState } from 'react';

import { MenuOption } from '@/components/Menu';
import { isUrl } from '@/utils';
import { ThemeMode } from '@/components/Config';

import { LayoutMenuState } from '../../types';
import { useLayout } from '../../hooks';

const MenuItem: FC<{ menu: MenuOption; parent?: MenuOption }> = ({ menu, parent }) => {
    if (menu.hide) return null;
    if (menu.children) {
        return (
            <Menu.SubMenu key={menu.id} title={menu.text} icon={menu.icon}>
                {menu.children
                    .map((child) => MenuItem({ menu: child, parent: menu }))
                    .filter((child) => child !== null)}
            </Menu.SubMenu>
        );
    }
    const icon = parent ? null : menu.icon;
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
    const [opens, setOpens] = useState(mode === 'horizontal' ? [] : menu.opens);
    const onOpenChange = useCallback(
        (keys: string[]) => {
            if (collapsed) return;
            const latest = keys.find((key) => opens.indexOf(key) === -1);
            if (latest && menu.rootSubKeys.indexOf(latest) === -1) {
                setOpens(keys);
            } else {
                setOpens(latest ? [latest] : []);
            }
        },
        [opens, collapsed],
    );
    const openKeys = useMemo(() => (collapsed ? [] : opens), [collapsed, opens]);
    return (
        <Menu
            theme={theme}
            mode={mode}
            openKeys={openKeys}
            selectedKeys={menu.selects}
            onOpenChange={onOpenChange}
        >
            {menu.data.map((item) => MenuItem({ menu: item })).filter((child) => child !== null)}
        </Menu>
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
