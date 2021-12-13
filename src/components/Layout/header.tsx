import { UserOutlined } from '@ant-design/icons';
import type { BasicLayoutProps } from '@ant-design/pro-layout';

import { Avatar } from 'antd';

export const HeaderRight: BasicLayoutProps['rightContentRender'] = () => (
    <div>
        <Avatar shape="square" size="small" icon={<UserOutlined />} />
    </div>
);
