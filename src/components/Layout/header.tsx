import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import type { BasicLayoutProps } from '@ant-design/pro-layout';

import { Avatar, Dropdown, Menu, Space } from 'antd';

import classNames from 'classnames';

import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTheme, useThemeDispatch } from '../Theme';
import { Icon } from '../Icon';

import { useAuthDispatch, useUser } from '../Auth';

import styles from './index.module.less';

import Sun from '~icons/carbon/sun';
import Moon from '~icons/carbon/moon';

const Theme = () => {
    const theme = useTheme();
    const { toggleTheme } = useThemeDispatch();
    return theme === 'dark' ? (
        <Icon component={Moon} className="cursor-pointer" onClick={toggleTheme} />
    ) : (
        <Icon component={Sun} className="cursor-pointer" onClick={toggleTheme} />
    );
};

const AuthMenu = (click: (params: { key: string }) => void) => (
    <Menu className={styles.menu} selectedKeys={[]} onClick={click}>
        <Menu.Item key="center">
            <UserOutlined />
            个人中心
        </Menu.Item>
        <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item key="logout">
            <LogoutOutlined />
            退出登录
        </Menu.Item>
    </Menu>
);

const User = () => {
    const user = useUser<RecordAny>();
    const navigate = useNavigate();
    const { clearToken } = useAuthDispatch();
    const onMenuClick = useCallback(({ key }: RecordAny) => {
        if (key === 'logout') {
            clearToken().then(() => navigate('/auth/login', { replace: true }));
        }
    }, []);
    return user ? (
        <Dropdown overlay={AuthMenu(onMenuClick)} trigger={['click']}>
            <div
                className={classNames([
                    'w-24',
                    'justify-around',
                    'items-center',
                    'cursor-pointer',
                    'flex',
                ])}
            >
                <Avatar
                    className={classNames([])}
                    size="small"
                    shape="square"
                    icon={<UserOutlined />}
                    alt="avatar"
                />
                <span className={classNames(['select-none'])}>{user.username}</span>
            </div>
        </Dropdown>
    ) : null;
};

const HeaderRight: BasicLayoutProps['rightContentRender'] = () => {
    return (
        <Space>
            <Theme />
            <User />
        </Space>
    );
};
export default HeaderRight;
