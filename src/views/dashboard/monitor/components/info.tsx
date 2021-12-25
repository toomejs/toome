import ProDescriptions from '@ant-design/pro-descriptions';
import { Badge, Typography } from 'antd';
import { memo, useCallback, useEffect, useState } from 'react';

import type { ServerItem } from '../types';
import { serverStatus } from '../constants';

const Label: FC<{ text: string }> = memo(({ text }) => (
    <Typography.Text type="secondary">{text}</Typography.Text>
));
export const ServerInfo: FC<{ data?: ServerItem }> = ({ data }) => {
    const [loadding, setLoading] = useState<boolean>();
    const mbToGb = useCallback(
        (value: number) => (value / 1024).toFixed(2).replace(/\.00$/, ''),
        [],
    );
    useEffect(() => {
        if (!data) setLoading(true);
        else setLoading(false);
    }, [data]);
    return (
        <ProDescriptions
            title="属性信息"
            column={1}
            labelStyle={{ flex: '0 0 5rem' }}
            loading={loadding}
        >
            <ProDescriptions.Item label={<Label text="操作系统" />}>
                <Typography.Paragraph className="max-w-[60%]" ellipsis>
                    {data?.os}
                </Typography.Paragraph>
            </ProDescriptions.Item>
            <ProDescriptions.Item label={<Label text="CPU核数" />}>
                {data?.cpu && `${data.cpu}核`}
            </ProDescriptions.Item>
            <ProDescriptions.Item label={<Label text="内存" />}>
                {data?.memory && `${mbToGb(data.memory)}G`}
            </ProDescriptions.Item>
            {data?.disk &&
                data.disk.map((i) => (
                    <ProDescriptions.Item key={i.path} label={<Label text={`硬盘${i.path}`} />}>
                        {`${mbToGb(i.value)}G`}
                    </ProDescriptions.Item>
                ))}
            <ProDescriptions.Item label={<Label text="状态" />}>
                {data?.status && (
                    <Badge
                        status={serverStatus[data.status].badge}
                        text={serverStatus[data.status].text}
                    />
                )}
            </ProDescriptions.Item>
            <ProDescriptions.Item label={<Label text="内网IP" />}>
                {data?.insetIp && (
                    <Typography.Paragraph className="mb-0" copyable>
                        {data.insetIp}
                    </Typography.Paragraph>
                )}
            </ProDescriptions.Item>
            <ProDescriptions.Item className="mb-0" label={<Label text="外网IP" />}>
                {data?.publicIp && (
                    <Typography.Paragraph copyable>{data.publicIp}</Typography.Paragraph>
                )}
            </ProDescriptions.Item>
        </ProDescriptions>
    );
};
