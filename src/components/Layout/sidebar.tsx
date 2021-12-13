import type { BasicLayoutProps } from '@ant-design/pro-layout';

export const SideFooter: BasicLayoutProps['menuFooterRender'] = (props) => {
    return (
        <a
            style={{
                lineHeight: '48rpx',
                display: 'flex',
                height: 48,
                color: 'rgba(255, 255, 255, 0.65)',
                alignItems: 'center',
            }}
            href="https://preview.pro.ant.design/dashboard/analysis"
            target="_blank"
            rel="noreferrer"
        >
            <img
                alt="pro-logo"
                src="https://procomponents.ant.design/favicon.ico"
                style={{
                    width: 16,
                    height: 16,
                    margin: '0 16px',
                    marginRight: 10,
                }}
            />
            {!props?.collapsed && 'Preview Pro'}
        </a>
    );
};
