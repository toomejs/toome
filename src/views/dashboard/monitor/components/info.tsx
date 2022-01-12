import ProDescriptions from '@ant-design/pro-descriptions';
import { Badge, Typography } from 'antd';
import { memo, useCallback } from 'react';

import { serverStatus } from '../constants';

import { useServer } from './data';

const Label: FC<{ text: string }> = memo(({ text }) => (
    <Typography.Text type="secondary">{text}</Typography.Text>
));
export const ServerInfo: FC = () => {
    const { server, loading } = useServer('1');
    const mbToGb = useCallback(
        (value: number) => (value / 1024).toFixed(2).replace(/\.00$/, ''),
        [],
    );
    return (
        <ProDescriptions
            title="属性信息"
            column={1}
            labelStyle={{ flex: '0 0 5rem' }}
            loading={loading}
        >
            <ProDescriptions.Item label={<Label text="操作系统" />}>
                <Typography.Paragraph className="max-w-[60%]" ellipsis>
                    {server?.os}
                </Typography.Paragraph>
            </ProDescriptions.Item>
            <ProDescriptions.Item label={<Label text="CPU核数" />}>
                {server?.cpu && `${server.cpu}核`}
            </ProDescriptions.Item>
            <ProDescriptions.Item label={<Label text="内存" />}>
                {server?.memory && `${mbToGb(server.memory)}G`}
            </ProDescriptions.Item>
            {server?.disk &&
                server.disk.map((i, index) => (
                    <ProDescriptions.Item key={i.path} label={<Label text={`硬盘${index + 1}`} />}>
                        {`${mbToGb(i.value)}G (${i.path})`}
                    </ProDescriptions.Item>
                ))}
            <ProDescriptions.Item label={<Label text="状态" />}>
                {server?.status && (
                    <Badge
                        status={serverStatus[server.status].badge}
                        text={serverStatus[server.status].text}
                    />
                )}
            </ProDescriptions.Item>
            <ProDescriptions.Item label={<Label text="内网IP" />}>
                {server?.insetIp && (
                    <Typography.Paragraph className="mb-0" copyable>
                        {server.insetIp}
                    </Typography.Paragraph>
                )}
            </ProDescriptions.Item>
            <ProDescriptions.Item className="mb-0" label={<Label text="外网IP" />}>
                {server?.publicIp && (
                    <Typography.Paragraph copyable>{server.publicIp}</Typography.Paragraph>
                )}
            </ProDescriptions.Item>
        </ProDescriptions>
    );
};
