import { Col, Input, Row, Tabs } from 'antd';
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
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { TabPane } = Tabs;
type TabItemType = { id: string; name: string; content: string };
type TabContextType = { active: string; data: Array<TabItemType> };
type TabActionContextType = {
    active: (id: string) => void;
    setData: (fn: (state: Draft<Array<TabItemType>>) => void | Array<TabItemType>) => void;
};
const TabContext = createContext<TabContextType | null>(null);
const TabActionContext = createContext<TabActionContextType | null>(null);
const TabItem: FC<{ id: string; moveTabNode: (dragKey: string, hoverKey: string) => void }> = ({
    id,
    moveTabNode,
    children,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop({
        accept: 'TAB',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: { id: string }, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            moveTabNode(item.id, id);
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: 'TAB',
        item: { id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    });

    const style = useMemo(() => (isDragging ? { cursor: 'move', opacity: 0.4 } : {}), [isDragging]);
    drag(drop(ref));
    return (
        <div ref={ref} className="mx-1" style={{ ...style }} data-handler-id={handlerId}>
            {children}
        </div>
    );
};
const RenderTabBar = (props: any, DefaultTabBar: ComponentType<any>) => {
    const value = useContext(TabContext);
    const actions = useContext(TabActionContext);
    const moveTabNode = useCallback(
        (dragKey: string, hoverKey: string) => {
            if (isNil(value) || isNil(actions)) return;
            actions.setData((state) => {
                const dragIndex = findIndex((item) => item.id === dragKey, state);
                const hoverIndex = findIndex((item) => item.id === hoverKey, state);
                const dragItem = find((item) => item.id === dragKey, state);
                if (dragIndex < 0 || hoverIndex < 0 || isNil(dragItem)) return;
                state.splice(dragIndex, 1);
                state.splice(hoverIndex, 0, dragItem);
            });
        },
        [value?.data, actions?.setData],
    );
    return (
        <DefaultTabBar {...props}>
            {(node: any) => {
                return (
                    <TabItem id={node.key} moveTabNode={moveTabNode}>
                        {node}
                    </TabItem>
                );
            }}
        </DefaultTabBar>
    );
};
const TabsWrapper = () => {
    const value = useContext(TabContext);
    const actions = useContext(TabActionContext);
    if (isNil(value) || isNil(actions)) return null;
    return (
        <Tabs
            type="editable-card"
            size="small"
            hideAdd
            activeKey={value.active}
            onChange={actions.active}
            renderTabBar={RenderTabBar}
        >
            {value.data.map((tab) => (
                <TabPane tab={tab.name} key={tab.id}>
                    {tab.content}
                </TabPane>
            ))}
        </Tabs>
    );
};
const Container: FC = ({ children }) => {
    const [tabs, setTabs] = useState<Array<TabItemType>>([
        {
            id: '1',
            name: 'tab1',
            content: 'tab-panel1',
        },
        {
            id: '2',
            name: 'tab2',
            content: 'tab-panel2',
        },
        {
            id: '3',
            name: 'tab3',
            content: 'tab-panel3',
        },
    ]);
    const [active, setActive] = useState<string>('1');
    const value = useMemo<TabContextType>(() => ({ active, data: tabs }), [active, tabs]);
    const changeActive = useCallback((id: string) => setActive(id), []);
    const changeTabs = useCallback(
        (fn: (state: Draft<Array<TabItemType>>) => void | Array<TabItemType>) => {
            const nextState = typeof fn === 'function' ? produce(fn) : fn;
            setTabs(nextState);
        },
        [],
    );
    const actions = useMemo<TabActionContextType>(
        () => ({
            active: changeActive,
            setData: changeTabs,
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
const Box = () => {
    // 使用 useDrag
    const [, drager] = useDrag({
        type: 'Box',
    });
    return (
        // 将第二个参数赋值给 ref
        <div ref={drager} style={{ backgroundColor: 'blue', width: '300px', height: '300px' }}>
            可拖拽组件 Box
        </div>
    );
};

const MonitorDashboard = () => {
    const [ddd, setDdd] = useState('monitor');
    const changeDdd = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setDdd(e.target.value),
        [],
    );
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="md:container md:mx-auto">
                <Row gutter={[8, 16]}>
                    <Col span={24}>
                        <Input value={ddd} onChange={changeDdd} />
                    </Col>
                    <Col span={24}>
                        <Container />
                    </Col>
                    <Col span={24}>
                        <Box />
                    </Col>
                </Row>
            </div>
        </DndProvider>
    );
};
export default MonitorDashboard;
