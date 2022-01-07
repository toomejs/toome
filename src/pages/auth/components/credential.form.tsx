import ProForm, { ProFormText } from '@ant-design/pro-form';

import { message } from 'antd';

import { FC, useCallback, useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useFetcher } from '@/components/Fetcher';
import { useRouter, useRouterStatus } from '@/components/Router';
import { getUser, useAuthDispatch } from '@/components/Auth';

export const CredentialForm: FC = () => {
    const { clearToken, setToken } = useAuthDispatch();
    const fetcher = useFetcher();
    const { basePath } = useRouter.useConfig();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasRouter = useRouterStatus.useSuccess();
    const getRedirect = useCallback(() => {
        let queryRedirect = searchParams.get('redirect');
        if (queryRedirect && queryRedirect.length > 0) {
            searchParams.forEach((v, k) => {
                if (k !== 'redirect') queryRedirect = `${queryRedirect}&${k}=${v}`;
            });
            return queryRedirect;
        }
        return basePath;
    }, []);
    useEffect(() => {
        const redirect = getRedirect();
        if (hasRouter && getUser()) {
            navigate(redirect, { replace: true });
        }
    }, [hasRouter]);
    return (
        <div className="p-4 w-full">
            <ProForm
                className="enter-x"
                onFinish={async (values) => {
                    await clearToken();
                    try {
                        const {
                            data: { token },
                        } = await fetcher.post('/user/auth/login', values);
                        if (token) await setToken(token);
                        message.success('登录成功');
                        // waitTime();
                    } catch (err) {
                        message.error('用户名或密码错误');
                    }
                }}
                submitter={{
                    searchConfig: {
                        submitText: '登录',
                    },
                    render: (_, dom) => dom.pop(),
                    submitButtonProps: {
                        size: 'large',
                        style: {
                            width: '100%',
                        },
                    },
                }}
            >
                <ProFormText
                    fieldProps={{
                        size: 'large',
                        // prefix: <MobileOutlined />,
                    }}
                    name="credential"
                    placeholder="请输入用户名,手机号或邮箱地址"
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号!',
                        },
                        {
                            message: '不合法的手机号格式!',
                        },
                    ]}
                />
                <ProFormText.Password
                    fieldProps={{
                        size: 'large',
                    }}
                    name="password"
                    placeholder="请输入密码"
                />
            </ProForm>
        </div>
    );
};
