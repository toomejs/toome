import { Dropdown, Menu, Tabs, TabsProps } from 'antd';

import { useCallback, useState } from 'react';

import { useActivedAlive, useKeepAliveDispath, useKeepAlives } from '@/components/KeepAlive';
import { FlatRouteItem, useRouter } from '@/components/Router';
import { useDeepCompareUpdateEffect } from '@/utils';
import { Icon } from '@/components/Icon';

import IconArrowDown from '~icons/ion/chevron-down-sharp';
import IconClose from '~icons/ion/close-outline';
import IconLeft from '~icons/mdi/arrow-collapse-left';
import IconRight from '~icons/mdi/arrow-collapse-right';
import IconExpend from '~icons/mdi/arrow-expand-horizontal';

const { TabPane } = Tabs;
const getNames = (routes: FlatRouteItem[]) =>
    Object.fromEntries(
        routes.map((route) => [route.id, route.meta?.text ?? route.name ?? route.id]),
    );
const ExtraButtons = () => {
    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<Icon component={IconClose} />}>
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    关闭当前标签页
                </a>
            </Menu.Item>
            <Menu.Item key="2" icon={<Icon component={IconExpend} />}>
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    关闭其它标签页
                </a>
            </Menu.Item>
            <Menu.Item key="3" icon={<Icon component={IconLeft} />}>
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    关闭左侧标签页
                </a>
            </Menu.Item>
            <Menu.Item key="4" icon={<Icon component={IconRight} />}>
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    关闭右侧标签页
                </a>
            </Menu.Item>
            <Menu.Item key="5" icon={<Icon component={IconClose} />}>
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    关闭所有标签页
                </a>
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} placement="bottomCenter" arrow>
            <Icon component={IconArrowDown} />
        </Dropdown>
    );
};
export const LayoutTabs = () => {
    const flats = useRouter.useFlats();
    const actived = useActivedAlive();
    const data = useKeepAlives();
    const { changeAlive, removeAlive } = useKeepAliveDispath();

    const remove: NonNullable<TabsProps['onEdit']> = useCallback((id, action: 'add' | 'remove') => {
        if (action !== 'remove' || typeof id !== 'string') return;
        removeAlive(id);
    }, []);
    const [names, setNames] = useState(() => getNames(flats));
    useDeepCompareUpdateEffect(() => {
        setNames(() => getNames(flats));
    }, [flats]);
    return actived ? (
        <div>
            <Tabs
                type="editable-card"
                activeKey={actived}
                onChange={changeAlive}
                onEdit={remove}
                tabBarExtraContent={<ExtraButtons />}
                hideAdd
                destroyInactiveTabPane
            >
                {data.map((id) => (
                    <TabPane tab={names[id] ?? 'undefined'} key={id} closable />
                ))}
            </Tabs>
        </div>
    ) : null;
};
