import { Tabs, TabsProps } from 'antd';

import { useCallback, useState } from 'react';

import {
    AliveActionType,
    KeepAliveStore,
    useActivedAlive,
    useKeepAlives,
} from '@/components/KeepAlive';
import { FlatRouteItem, useNavigator, useRouter } from '@/components/Router';
import { useDeepCompareUpdateEffect } from '@/utils';

const { TabPane } = Tabs;
const getNames = (routes: FlatRouteItem[]) =>
    Object.fromEntries(
        routes.map((route) => [route.id, route.meta?.text ?? route.name ?? route.id]),
    );
export const LayoutTabs = () => {
    const flats = useRouter.useFlats();
    const actived = useActivedAlive();
    const data = useKeepAlives();
    const navigate = useNavigator();
    const changeAlive = useCallback(
        (id: string) => {
            console.log(id);
            if (actived !== id) navigate({ id });
        },
        [actived],
    );
    const removeAlive: NonNullable<TabsProps['onEdit']> = useCallback(
        (id, action: 'add' | 'remove') => {
            if (action !== 'remove' || typeof id !== 'string') return;
            KeepAliveStore.dispatch({
                type: AliveActionType.REMOVE,
                params: { id, navigate },
            });
        },
        [actived],
    );
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
                onEdit={removeAlive}
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
