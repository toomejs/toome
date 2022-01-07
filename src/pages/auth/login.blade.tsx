import type { FC } from 'react';

import bgimg from '../../assets/svg/login-box-bg.svg';

import { CredentialForm } from './components';
// import styles from './login.module.less';

const Login: FC = () => {
    return (
        <div className={` relative w-full h-full px-4`}>
            <span className="-enter-x xl:hidden" />

            <div className="container relative h-full py-2 mx-auto sm:px-10">
                <div className="flex h-full">
                    <div className="hidden xl:flex xl:flex-col xl:w-6/12 min-h-full mr-4 pl-4">
                        <div className="my-auto">
                            <img alt="title" src={bgimg} className="w-1/2 -mt-16 -enter-x" />
                            <div className="mt-10 font-medium text-white -enter-x">
                                <span className="mt-4 text-3xl inline-block">
                                    基于Vite+React的管理面板
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-full xl:h-auto flex py-5 xl:py-0 xl:my-0 w-full xl:w-6/12">
                        <div className="login-form my-auto mx-auto xl:ml-20 xl:bg-transparent px-5 py-8 sm:px-8 xl:p-4 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto enter-x relative">
                            <CredentialForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
