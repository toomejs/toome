/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-14 00:07:50 +0800
 * Updated_at     : 2022-01-09 20:08:05 +0800
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
    import.meta.glob('../../../pages/**/*.blade.{tsx,jsx}'),
    /..\/..\/\..\/pages\/([\w+.?/?]+)(.blade.tsx)|(.blade.jsx)/i,
);
/**
 * 所有动态布局映射
 */
export const layouts = getAsyncImports(
    import.meta.glob('../../../layouts/**/*.blade.{tsx,jsx}'),
    /..\/..\/\..\/layouts\/([\w+.?/?]+)(.blade.tsx)|(.blade.jsx)/i,
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
    /** 是否为布局 */
    layout?: boolean;
}) => {
    const { cacheKey, page, layout } = props;
    const fallback: JSX.Element | undefined = props.loading ? <props.loading /> : undefined;
    const view = layout ? layouts[page] : pages[page];
    return loadable(() => timeout(pMinDelay(view(), 50), 220000), {
        cacheKey: () => cacheKey,
        fallback,
    });
};
