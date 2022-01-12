import type { FC } from 'react';

import { Button } from 'antd';

import { useThemeDispatch } from '@/components/Config';

const ArticlesList: FC = () => {
    const { toggleTheme } = useThemeDispatch();
    return (
        <div>
            <Button type="primary" onClick={toggleTheme}>
                更改主题
            </Button>
        </div>
    );
};
export default ArticlesList;
