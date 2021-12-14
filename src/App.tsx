import './App.css';
import { useSetupAuth } from './components/Auth';
import { useSetupIcon } from './components/Icon';
import { useSetupMenu } from './components/Menu';

import { Router } from './components/Router/provider';
import { useSetupRouter } from './components/Router/setup';

import { useSetupStorage } from './components/Storage';
import { routing } from './config/routeConfig';

const App = () => {
    // useConfigInit(config);
    useSetupStorage();
    useSetupAuth('/user/info');
    useSetupRouter(routing);
    useSetupMenu();
    useSetupIcon({
        iconfont_urls: ['//at.alicdn.com/t/font_2497975_4zt848h920t.js'],
    });
    // useSetupIcon();
    return <Router />;
};

export default App;
