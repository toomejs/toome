import type { FC } from 'react';

export const AppHeader: FC = () => {
    console.log('header');
    return (
        <header>
            <div>Logo</div>
            <div>breadcrumbs</div>
            <div>user menus</div>
        </header>
    );
};
