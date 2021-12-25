import './App.css';
import { useSetupAuth } from './components/Auth';
import { useSetupCharts } from './components/Charts';
import { SWRFetcher, useSetupFetcher } from './components/Fetcher';
import { useSetupIcon } from './components/Icon';
import { useSetupMenu } from './components/Menu';

import { useSetupRouter } from './components/Router';
import { Router } from './components/Router/provider';

import { useSetupStorage } from './components/Storage';
import { useSetupTheme } from './components/Theme';
import { router } from './config';

const App = () => {
    // useConfigInit(config);
    // 初始化本地存储
    useSetupStorage();
    // 初始化请求库和SWR,如果不需要自定义全局配置可不写
    useSetupFetcher();
    // 通过本地存储的Token获取远程用户信息
    useSetupAuth('/user/info');
    // 通过用户信息初始化路由
    useSetupRouter(router);
    // 通过路由或用户信息初始化菜单
    useSetupMenu();
    // useSetupMenu();
    // 初始化主题和颜色
    useSetupTheme();
    // 初始化图标配置
    useSetupIcon({
        iconfont_urls: ['//at.alicdn.com/t/font_2497975_4zt848h920t.js'],
    });

    useSetupCharts();
    // 加载路由页面
    return (
        <SWRFetcher>
            <Router />
        </SWRFetcher>
    );
};

export default App;
