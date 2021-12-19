import './App.css';
import { useSetupAuth } from './components/Auth';
import { useSetupCharts } from './components/Charts';
import { useSetupIcon } from './components/Icon';
import { useSetupMenu } from './components/Menu';

import { useSetupRouter } from './components/Router';
import { Router } from './components/Router/provider';

import { useSetupStorage } from './components/Storage';
import { useSetupTheme } from './components/Theme';
import { routing } from './config/routeConfig';

const App = () => {
    // useConfigInit(config);
    // 初始化本地存储
    useSetupStorage();
    // 通过本地存储的Token获取远程用户信息
    useSetupAuth('/user/info');
    // 通过用户信息初始化路由
    useSetupRouter(routing);
    // 通过路由或用户信息初始化菜单
    useSetupMenu();
    // 初始化主题和颜色
    useSetupTheme();
    // 初始化图标配置
    useSetupIcon({
        iconfont_urls: ['//at.alicdn.com/t/font_2497975_4zt848h920t.js'],
    });

    useSetupCharts();
    // 加载路由页面
    return <Router />;
};

export default App;
