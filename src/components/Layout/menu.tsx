import type { BasicLayoutProps } from '@ant-design/pro-layout';

import { Link } from 'react-router-dom';

import { isUrl } from '@/utils';

export const MenuItem: BasicLayoutProps['menuItemRender'] = (item, dom) => {
    if (!item) return null;
    if (!item.path) {
        return <a onClick={(e) => e.preventDefault()}>{dom}</a>;
    }
    if (isUrl(item.path)) {
        return (
            <a href={item.path} target={item.target ?? '_blank'}>
                {dom}
            </a>
        );
    }
    return <Link to={item.path}>{dom}</Link>;
};
export const SubMenuItem: BasicLayoutProps['subMenuItemRender'] = (item: any, dom: any) => (
    <div ref={(el) => el && el.addEventListener('selectstart', (e) => e.preventDefault())}>
        {dom}
    </div>
);
