import { Col, Input, Row } from 'antd';
import { useCallback, useState } from 'react';

const WorkspaceDashboard = () => {
    const [ddd, setDdd] = useState('workspace');
    const changeDdd = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setDdd(e.target.value),
        [],
    );
    return (
        <div className="md:container md:mx-auto">
            <Row gutter={[8, 16]}>
                <Col span={24}>
                    <Input value={ddd} onChange={changeDdd} />
                </Col>
            </Row>
        </div>
    );
};
export default WorkspaceDashboard;
