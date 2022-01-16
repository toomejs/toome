import { useCallback, useState } from 'react';

const AnlysisDashboard = () => {
    const [ddd, setDdd] = useState('anlysis');
    const changeDdd = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setDdd(e.target.value),
        [],
    );
    return <div>分析页</div>;
    // return (
    //     <div className="md:container md:mx-auto">
    //         <Row gutter={[8, 16]}>
    //             <Col span={24}>
    //                 <Input value={ddd} onChange={changeDdd} />
    //             </Col>
    //         </Row>
    //     </div>
    // );
};
export default AnlysisDashboard;
