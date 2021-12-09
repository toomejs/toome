import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { useAppRouter } from '@/components/Router';
import type { MenuOption } from '@/components/Router';

const MenuItem: FC<{ menu: MenuOption }> = ({ menu }) => {
    const MenuChildren = menu.children && menu.children.length > 0 && (
        <MenuList menus={menu.children} />
    );
    let MenuLink: ReactNode;
    if (menu.url || menu.divide) {
        MenuLink = menu.url ? (
            <a href={menu.url} title={menu.text} target="_blank" rel="noreferrer">
                {menu.label}
            </a>
        ) : (
            <span />
        );
    } else {
        MenuLink = <Link to={menu.path!}>{menu.text}</Link>;
    }
    return (
        <li>
            {MenuLink}
            {MenuChildren}
        </li>
    );
};
const MenuList: FC<{ menus: MenuOption[] }> = ({ menus }) => (
    <ul>
        {menus.map((menu, index) => (
            <MenuItem menu={menu} key={menu.id} />
        ))}
    </ul>
);
export const AppSidebar: FC = () => {
    const { menus } = useAppRouter();
    return (
        <aside>
            <MenuList menus={menus} />
        </aside>
    );
};
