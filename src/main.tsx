import { enableMapSet } from 'immer';

import ReactDOM from 'react-dom';

import '@/styles/index.less';

import App from './App';

if (import.meta.env.DEV) {
    import('antd/dist/antd.less');
}
enableMapSet();

ReactDOM.render(<App />, document.getElementById('root'));
