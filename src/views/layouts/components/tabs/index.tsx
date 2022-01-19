import { Dropdown, Menu, Tabs, TabsProps } from 'antd';

import { memo, useCallback, useMemo, useState } from 'react';

import { addIndex, filter, findIndex } from 'ramda';

import { useActivedAlive, useKeepAliveDispath, useKeepAlives } from '@/components/KeepAlive';
import { FlatRouteItem, useRouter } from '@/components/Router';
import { useDeepCompareUpdateEffect } from '@/utils';
import { Icon } from '@/components/Icon';

import $styles from './index.module.less';

import IconRefresh from '~icons/ion/md-refresh';
import IconArrowDown from '~icons/ion/chevron-down-sharp';
import IconClose from '~icons/ion/close-outline';
import IconLeft from '~icons/mdi/arrow-collapse-left';
import IconRight from '~icons/mdi/arrow-collapse-right';
import IconExpend from '~icons/mdi/arrow-expand-horizontal';
import IconClear from '~icons/ant-design/minus-outlined';

const { TabPane } = Tabs;
const getNames = (routes: FlatRouteItem[]) =>
    Object.fromEntries(
        routes.map((route) => [route.id, route.meta?.text ?? route.name ?? route.id]),
    );
const ExtraButtons: FC<{ actived: string }> = memo(({ actived }) => {
    const data = useKeepAlives();
    const { removeAlive, removeAlives, clearAlives, refreshAlive } = useKeepAliveDispath();
    const activedIndex = useMemo(
        () => findIndex((item) => item === actived, data),
        [data, actived],
    );
    const disabledRemoveOthers = useMemo(
        () => filter((item) => item !== actived, data).length <= 0,
        [activedIndex, data],
    );
    const disabledLeftRemove = useMemo(() => activedIndex < 1, [activedIndex]);
    const disabledRightRemove = useMemo(
        () => activedIndex >= data.length - 1,
        [activedIndex, data],
    );
    const refreshActived = useCallback(() => refreshAlive(actived), [actived]);
    const removeActived = useCallback(() => removeAlive(actived), [actived]);
    const removeOthers = useCallback(
        () => removeAlives(filter((item) => item !== actived, data)),
        [data, actived],
    );
    const removeLeft = useCallback(
        () => removeAlives(addIndex(filter)((_, index) => index < activedIndex, data)),
        [data, disabledLeftRemove, activedIndex],
    );
    const removeRight = useCallback(
        () => removeAlives(addIndex(filter)((_, index) => index > activedIndex, data)),
        [data, disabledRightRemove, activedIndex],
    );
    const menu = (
        <Menu>
            <Menu.Item key="refresh" icon={<Icon component={IconRefresh} />}>
                <span onClick={refreshActived}>刷新</span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="remove-actived" icon={<Icon component={IconClose} />}>
                <span onClick={removeActived}>关闭当前</span>
            </Menu.Item>
            <Menu.Item
                key="remove-others"
                icon={<Icon component={IconExpend} />}
                disabled={disabledRemoveOthers}
            >
                <span onClick={removeOthers}>关闭其它</span>
            </Menu.Item>
            <Menu.Item
                key="remove-left"
                icon={<Icon component={IconLeft} />}
                disabled={disabledLeftRemove}
            >
                <span onClick={removeLeft}>关闭左侧</span>
            </Menu.Item>
            <Menu.Item
                key="remove-right"
                icon={<Icon component={IconRight} />}
                disabled={disabledRightRemove}
            >
                <span onClick={removeRight}>关闭右侧</span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="remove-all" icon={<Icon component={IconClear} />}>
                <span onClick={clearAlives}>清空标签</span>
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click', 'hover']}>
            <span className="bg-white dark:bg-slate-900 flex py-1 px-1">
                <Icon component={IconArrowDown} />
            </span>
        </Dropdown>
    );
});
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
        <div className={`${$styles.container} px-2 py-1`}>
            <Tabs
                type="editable-card"
                size="small"
                activeKey={actived}
                onChange={changeAlive}
                onEdit={remove}
                tabBarExtraContent={<ExtraButtons actived={actived} />}
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
