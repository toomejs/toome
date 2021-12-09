import { Button } from 'antd';
import type { FC } from 'react';

export const AppFooter: FC = () => {
    console.log('footer');
    return (
        <footer>
            <Button>Logo</Button>
            @CopyRight
        </footer>
    );
};
