import { animated, useSpring } from '@react-spring/web';
import { Tabs } from 'antd';
import produce, { Draft } from 'immer';
import { find, findIndex, isNil } from 'ramda';
import {
    ComponentType,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';
import { DropTargetMonitor, useDrag, XYCoord, useDrop } from 'react-dnd';

import type { FC } from 'react';

import styles from './index.module.less';

const { TabPane } = Tabs;

type TabItemType = { id: string; name: string; content: string };
type TabContextType = { active: string; data: Array<TabItemType> };
type TabActionContextType = {
    changeOrder: (dragKey: string, hoverKey: string) => void;
    setActive: (id: string) => void;
    setData: (fn: (state: Draft<Array<TabItemType>>) => void | Array<TabItemType>) => void;
};
const useIndexGetter = () => {
    const { data } = useContext(TabContext);
    return useCallback((id: string) => data.map((item) => item.id).indexOf(id), [data]);
};
const getTabStyles = (index: number, isDragging = false) => {
    const x = `${(index * 85) / 16}rem`;
    return {
        x,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 2 : 1,
        scale: isDragging ? 2 : 1,
    };
};
const TabContext = createContext<TabContextType>({} as any);
const TabActionContext = createContext<TabActionContextType>({} as any);
const TabItem: FC<{ id: string }> = ({ id, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { changeOrder } = useContext(TabActionContext);
    const getIndex = useIndexGetter();
    const index = getIndex(id);
    const [{ isDragging }, drag, preview] = useDrag({
        type: 'TAB',
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            if (!monitor.didDrop()) changeOrder(item.id, item.id);
        },
    });
    const [, drop] = useDrop({
        accept: 'TAB',
        hover(item: { id: string }, monitor: DropTargetMonitor) {
            if (!ref.current || item.id === id || !monitor.isOver({ shallow: true })) return;
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.x;
            const dragIndex = getIndex(item.id);
            if (dragIndex < index && hoverClientX < hoverMiddleX) {
                return;
            }

            if (dragIndex > index && hoverClientX > hoverMiddleX) {
                return;
            }
            changeOrder(item.id, id);
        },
        collect: (monitor) => ({
            hover: monitor.isOver({ shallow: true }) && monitor.canDrop(),
        }),
    });

    const [previewStyle] = useSpring<any>(
        () =>
            isDragging
                ? {
                      scale: 2,
                  }
                : { scale: 1 },
        [isDragging],
    );
    const [nodeStyle] = useSpring<any>(
        () => ({ x: `${(index * 85) / 16}rem`, opacity: isDragging ? 0 : 1 }),
        [index, isDragging],
    );
    drag(drop(ref));
    return (
        <animated.div ref={preview} style={previewStyle}>
            <animated.div ref={ref} className="w-20 h-9 absolute" style={nodeStyle}>
                {children}
            </animated.div>
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
