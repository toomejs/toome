/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-14 00:07:50 +0800
 * Updated_at     : 2022-01-14 00:46:36 +0800
 * Path           : /src/components/Router/utils/views.tsx
 * Description    : 页面和视图组件
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { FC, FunctionComponent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { timeout } from 'promise-timeout';
import { has } from 'lodash-es';

import { RoutePage } from '../types';

/**
 * 根据正则和glob递归获取所有动态页面导入映射
 * [key:bar/foo]: () => import('{起始目录: 如page}/bar/foo.blade.tsx')
 * @param imports 需要遍历的路径规则,支持glob
 * @param reg 用于匹配出key的正则表达式
 */
const getAsyncImports = (imports: Record<string, () => Promise<any>>, reg: RegExp) => {
    return Object.keys(imports)
        .map((key) => {
            const names = reg.exec(key);
            return Array.isArray(names) && names.length >= 2
                ? { [names[1]]: imports[key] }
                : undefined;
        })
        .filter((m) => !!m)
        .reduce((o, n) => ({ ...o, ...n }), []) as unknown as Record<string, () => Promise<any>>;
};
/**
 * 所有动态页面映射
 */
export const pages = getAsyncImports(
    import.meta.glob('../../../views/**/*.blade.{tsx,jsx}'),
    /..\/..\/\..\/views\/([\w+.?/?]+)(.blade.tsx)|(.blade.jsx)/i,
);

/**
 * 未登录跳转页面组件
 * @param props
 */
export const AuthRedirect: FC<{
    /** 登录跳转地址 */
    loginPath?: string;
}> = ({ loginPath }) => {
    const location = useLocation();
    let redirect = `?redirect=${location.pathname}`;
    if (location.search) redirect = `${redirect}${location.search}`;
    return <Navigate to={`${loginPath}${redirect}`} replace />;
};
/**
 * 异步页面组件
 * @param props
 */
export const getAsyncPage = (props: {
    /** 缓存key */
    cacheKey: string;
    /** loading组件 */
    loading: FunctionComponent | false;
    /** 页面路径 */
    page: string;
}) => {
    const { cacheKey, page } = props;
    const fallback: JSX.Element | undefined = props.loading ? <props.loading /> : undefined;
    if (!has(pages, page)) throw new Error(`Page ${page} not exits in 'views' dir!`);
    return loadable(() => timeout(pMinDelay(pages[page](), 50), 220000), {
        cacheKey: () => cacheKey,
        fallback,
    });
};

export const IFramePage: RoutePage<{ to: string }> = ({ route, to }) => {
    return <iframe id={route.id} title={route.meta?.text} width="100%" height="100%" src={to} />;
};
