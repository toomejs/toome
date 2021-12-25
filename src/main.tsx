/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2021-12-16 14:56:38 +0800
 * @Path           : /src/main.tsx
 * @Description    : 入口文件,在此启动项目
 * @LastEditors    : pincman
 * Copyright 2021 pincman, All Rights Reserved.
 *
 */
import { enableMapSet } from 'immer';
import ReactDOM from 'react-dom';
// import 'virtual:windi-base.css';
// import 'virtual:windi-components.css';
// import 'virtual:windi-utilities.css';
// import 'virtual:windi-devtools';
import 'virtual:svg-icons-register';

import '@/styles/antd/index.less';
import '@/styles/index.css';

import App from './App';

if (import.meta.env.DEV) {
    import('antd/dist/antd.less');
}
enableMapSet();

ReactDOM.render(<App />, document.getElementById('root'));
