import { animated, SpringRef, useSpring } from '@react-spring/web';
import { Tabs } from 'antd';
import produce, { Draft } from 'immer';
import { find, findIndex, isNil } from 'ramda';
import { ComponentType, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { useUpdateEffect } from 'react-use';

import { useDebounceFn } from 'ahooks';

import styles from './index.module.less';

import { Lookup } from '.pnpm/@react-spring+types@9.4.3/node_modules/@react-spring/types';

const { TabPane } = Tabs;

type TabItemType = { id: string; name: string; content: string };
type TabContextType = { active: string; data: Array<TabItemType> };
type TabActionContextType = {
    changeOrder: (dragKey: string, hoverKey: string) => void;
    setActive: (id: string) => void;
    setData: (fn: (state: Draft<Array<TabItemType>>) => void | Array<TabItemType>) => void;
};
const useOriginalIndex = (id: string) => {
    const { data } = useContext(TabContext);
    return useMemo(() => data.map((item) => item.id).indexOf(id), [id, data]);
};
const getTabStyles = (index: number, curIndex: number, isDragging = false) => {
    return isDragging
        ? { cursor: 'move', opacity: 0.4, x: `${(index * 85) / 16}rem` }
        : { cursor: 'auto', opacity: 1 };
};
const TabContext = createContext<TabContextType>({} as any);
const TabActionContext = createContext<TabActionContextType>({} as any);
const TabItem: FC<{ id: string }> = ({ id, children }) => {
    const { move } = useContext(TabActionContext);
    const index = useOriginalIndex(id);
    const [spring, api] = useSpring<any>(() => getTabStyles(index), []);
    const [{ isDragging }, drag] = useDrag(
        {
            type: 'TAB',
            item: { id, index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                if (!monitor.didDrop()) move(item.id, item.id);
            },
        },
        [id, index, move],
    );
    const [, drop] = useDrop(
        {
            accept: 'TAB',
            hover(item: { id: string }, monitor: DropTargetMonitor) {
                if (item.id !== id && monitor.isOver({ shallow: true })) {
                    move(item.id, id);
                }
            },
            collect: (monitor) => ({
                hover: monitor.isOver({ shallow: true }) && monitor.canDrop(),
            }),
        },
        [move],
    );
    const { run: startSpring } = useDebounceFn(
        (springApi: SpringRef<Lookup<any>>, springStyle: any) => {
            springApi.start(springStyle);
        },
        { wait: 10 },
    );
    useUpdateEffect(() => {
        startSpring(api, getTabStyles(index, isDragging));
    }, [isDragging]);
    useUpdateEffect(() => {
        startSpring(api, getTabStyles(index));
    }, [index]);
    return (
        <animated.div ref={(node) => drag(drop(node))} className="absolute w-20 h-9" style={spring}>
            {children}
        </animated.div>
    );
};

const RenderTabBar = (props: any, DefaultTabBar: ComponentType<any>) => {
    const render = useCallback((node) => <TabItem id={node.key}>{node}</TabItem>, []);
    return <DefaultTabBar {...props}>{render}</DefaultTabBar>;
};
const TabsWrapper = () => {
    const { active, data } = useContext(TabContext);
    const actions = useContext(TabActionContext);
    return (
        <Tabs
            type="editable-card"
            size="small"
            hideAdd
            activeKey={active}
            onChange={actions.setActive}
            renderTabBar={RenderTabBar}
            className={styles.navTabs}
            style={{ '--tab-container-width': `${(data.length * 85) / 16}rem` } as any}
        >
            {data.map((tab) => (
                <TabPane tab={tab.name} key={tab.id}>
                    {tab.content}
                </TabPane>
            ))}
        </Tabs>
    );
};
export const DndContainer: FC = ({ children }) => {
    const [tabs, setTabs] = useState<Array<TabItemType>>(
        Array.from(Array(20).keys()).map((i) => ({
            id: i.toString(),
            name: `tab${i.toString()}`,
            content: `tab-panel${i.toString()}`,
        })),
    );
    const [active, setActive] = useState<string>('1');
    const value = useMemo<TabContextType>(() => ({ active, data: tabs }), [active, tabs]);
    const setActiveTab = useCallback((id: string) => setActive(id), []);
    const changeTabs = useCallback(
        (fn: (state: Draft<Array<TabItemType>>) => void | Array<TabItemType>) => {
            const nextState = typeof fn === 'function' ? produce(fn) : fn;
            setTabs(nextState);
        },
        [],
    );
    const changeTabsOrder = useCallback(
        (dragKey: string, hoverKey: string) => {
            changeTabs((state) => {
                const dragIndex = findIndex((item) => item.id === dragKey, state);
                const hoverIndex = findIndex((item) => item.id === hoverKey, state);
                const dragItem = find((item) => item.id === dragKey, state);
                if (dragIndex < 0 || hoverIndex < 0 || isNil(dragItem)) return;
                state.splice(dragIndex, 1);
                state.splice(hoverIndex, 0, dragItem);
            });
        },
        [changeTabs],
    );
    const actions = useMemo<TabActionContextType>(
        () => ({
            setActive: setActiveTab,
            setData: changeTabs,
            changeOrder: changeTabsOrder,
        }),
        [],
    );
    return (
        <TabContext.Provider value={value}>
            <TabActionContext.Provider value={actions}>
                <TabsWrapper />
            </TabActionContext.Provider>
        </TabContext.Provider>
    );
};
