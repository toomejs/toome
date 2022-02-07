import { useSetupAuth } from './components/Auth';
import { useSetupConfig } from './components/Config';
import { SWRFetcher, useSetupFetcher } from './components/Fetcher';
import { useSetupIcon } from './components/Icon';
import { useSetupKeepAlive } from './components/KeepAlive';
import { useSetupMenu } from './components/Menu';
import { Router, useSetupRouter } from './components/Router';
import { useSetupStorage } from './components/Storage';
import { config, router } from './config';

const useSetup = () => {
    // 初始化本地存储
    useSetupStorage();
    useSetupConfig(config);
    // 初始化请求库和SWR,如果不需要自定义全局配置可不写
    useSetupFetcher();
    // 通过本地存储的Token获取远程用户信息
    useSetupAuth('/user/info');
    // 通过用户信息初始化路由
    useSetupRouter(router);
    useSetupKeepAlive({ path: '/' });
    // 通过路由或用户信息初始化菜单
    useSetupMenu();
    // 初始化图标配置
    useSetupIcon({
        iconfont_urls: ['//at.alicdn.com/t/font_2497975_4zt848h920t.js'],
    });
    // useSetupChart();
};
const App = () => {
    useSetup();
    return (
        <SWRFetcher>
            <Router />
        </SWRFetcher>
    );
};

export default App;
