import { Col, Input, Row } from 'antd';
import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DndContainer } from './dnd';

const MonitorDashboard = () => {
    const [ddd, setDdd] = useState('monitor');
    const changeDdd = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setDdd(e.target.value),
        [],
    );
    return (
        <DndProvider backend={HTML5Backend}>
            <div className=" md:mx-auto w-6/12">
                <Row gutter={[8, 16]}>
                    <Col span={24}>
                        <Input value={ddd} onChange={changeDdd} />
                    </Col>
                    <Col span={24}>
                        <DndContainer />
                    </Col>
                </Row>
            </div>
        </DndProvider>
    );
};
export default MonitorDashboard;
