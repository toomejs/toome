import type { BasicLayoutProps } from '@ant-design/pro-layout';
import { useNavigate } from 'react-router-dom';

export const MenuItem: BasicLayoutProps['menuItemRender'] = (item, dom) => {
    const navigate = useNavigate();
    if (item.isUrl) {
        return (
            <a href={item.path} target={item.target ?? '_blank'}>
                {dom}
            </a>
        );
    }
    return (
        <a
            onClick={(e) => {
                e.preventDefault();
                if (item.path) navigate(item.path);
            }}
        >
            {dom}
        </a>
    );
};
export const SubMenuItem: BasicLayoutProps['subMenuItemRender'] = (item: any, dom: any) => (
    <div ref={(el) => el && el.addEventListener('selectstart', (e) => e.preventDefault())}>
        {dom}
    </div>
);
