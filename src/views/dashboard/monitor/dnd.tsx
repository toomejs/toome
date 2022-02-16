import { animated, useSpring } from '@react-spring/web';
import { Tabs } from 'antd';
import produce, { Draft } from 'immer';
import { find, findIndex, isNil } from 'ramda';
import {
    ComponentType,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import useMeasure from 'react-use-measure';
import mergeRefs from 'react-merge-refs';

import { useUpdateEffect } from 'react-use';

import { ResizeObserver } from '@juggle/resize-observer';

import styles from './index.module.less';

const { TabPane } = Tabs;

type TabItemType = { id: string; name: string; content: string };
type TabContextType = { active: string; moving: string | null; data: Array<TabItemType> };
type TabActionContextType = {
    active: (id: string) => void;
    setMoving: (id: string | null) => void;
    move: (dragKey: string, hoverKey: string) => void;
    setData: (fn: (state: Draft<Array<TabItemType>>) => void | Array<TabItemType>) => void;
};
const useOriginalIndex = (id: string) => {
    const { data } = useContext(TabContext);
    return useMemo(() => data.map((item) => item.id).indexOf(id), [id, data]);
};
const getTabStyles = (index: number, isDragging = false) => {
    return isDragging
        ? {
              cursor: 'move',
              opacity: 0.4,
              zIndex: 1,
              //   x: (index + 1) * 100,
          }
        : { cursor: 'auto', opacity: 1, x: index * 100, zIndex: 0 };
};
const TabContext = createContext<TabContextType>({} as any);
const TabActionContext = createContext<TabActionContextType>({} as any);
const TabItem: FC<{ id: string }> = ({ id, children }) => {
    const { move } = useContext(TabActionContext);
    const index = useOriginalIndex(id);
    const [spring, api] = useSpring<any>(() => getTabStyles(index), [index]);
    const [ref, b] = useMeasure({ debounce: 10, scroll: true, polyfill: ResizeObserver });
    useUpdateEffect(() => {
        console.log(b);
    }, [b]);
    const [{ isDragging }, drag] = useDrag({
        type: 'TAB',
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            if (!monitor.didDrop()) move(item.id, id);
        },
    });
    const [, drop] = useDrop({
        accept: 'TAB',
        hover(item: { id: string }, monitor: DropTargetMonitor) {
            if (item.id !== id) move(item.id, id);
        },
    });
    useEffect(() => {
        api.start(getTabStyles(index, isDragging));
    }, [isDragging]);
    return (
        <animated.div
            ref={mergeRefs([(node) => drag(drop(node)), ref])}
            className="absolute w-20 h-9"
            style={spring}
        >
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
            onChange={actions.active}
            renderTabBar={RenderTabBar}
            className={styles.navTabs}
            style={{ '--tab-container-width': `${(data.length * 100) / 16}rem` } as any}
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
    const [moving, setMoving] = useState<string | null>(null);
    const value = useMemo<TabContextType>(
        () => ({ active, data: tabs, moving }),
        [active, tabs, moving],
    );
    const changeActive = useCallback((id: string) => setActive(id), []);
    const changeTabs = useCallback(
        (fn: (state: Draft<Array<TabItemType>>) => void | Array<TabItemType>) => {
            const nextState = typeof fn === 'function' ? produce(fn) : fn;
            setTabs(nextState);
        },
        [],
    );
    const moveTabNode = useCallback(
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
            active: changeActive,
            setData: changeTabs,
            move: moveTabNode,
            setMoving,
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
