import { useDeepCompareEffect } from 'ahooks';
import { Button } from 'antd';
import type { FC } from 'react';

import { Link } from 'react-router-dom';

import { useStorage, useStorageStore } from '@/components/Storage';

const DoF: FC = () => {
    const config = useStorageStore.useConfig();
    useDeepCompareEffect(() => {
        // console.log(config);
    }, [config]);
    // console.log('渲染变量1');
    return <div>fff</div>;
};
const DoK: FC = () => {
    const doF = useStorageStore.useDoF();
    // console.log('渲染变量2');
    return <div>{doF.toString()}</div>;
};
const DoQ: FC = () => {
    const { addTable } = useStorage();
    // console.log('渲染操作1');
    return (
        <Button
            type="primary"
            onClick={() => {
                addTable({ name: 'test' });
            }}
        >
            Change Config
        </Button>
    );
};
const DoIn: FC = () => {
    const { doIn } = useStorage();
    // console.log('渲染操作2');
    return (
        <>
            <Link to="/auth/signup">Link</Link>
            <Button type="primary" onClick={() => doIn()}>
                Change DoF
            </Button>
        </>
    );
};
const Dashboard: FC = () => {
    return (
        <div>
            Dashboard
            <DoF />
            <DoQ />
            <DoIn />
            <DoK />
        </div>
    );
};
export default Dashboard;
