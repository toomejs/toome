import './App.css';
import { useSetupUser } from './components/Auth';

// import { AppRouter } from './components/Router';

import { Router } from './components/Routing';

import { useStorageInit } from './components/Storage';
import { routing } from './config/routeConfig';

const App = () => {
    // useConfigInit(config);
    useStorageInit();
    useSetupUser('/user/info');
    return <Router config={routing} />;
    // return <AppRouter config={routerConfig} />;
};

export default App;
