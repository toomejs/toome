import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import type { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { timeout } from 'promise-timeout';

import { Spinner } from '@/components/Spinner';

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
export const pages = getAsyncImports(
    import.meta.glob('../../../pages/**/*.blade.{tsx,jsx}'),
    /..\/..\/\..\/pages\/([\w+.?/?]+)(.blade.tsx)|(.blade.jsx)/i,
);
export const layouts = getAsyncImports(
    import.meta.glob('../../../layouts/**/*.blade.{tsx,jsx}'),
    /..\/..\/\..\/layouts\/([\w+.?/?]+)(.blade.tsx)|(.blade.jsx)/i,
);

export const AuthRedirect: FC<{
    loginPath?: string;
}> = ({ loginPath }) => {
    const location = useLocation();
    let redirect = `?redirect=${location.pathname}`;
    if (location.search) redirect = `${redirect}${location.search}`;
    return <Navigate to={`${loginPath}${redirect}`} replace />;
};

export const getAsyncPage = (props: {
    cacheKey: string;
    loading?: JSX.Element | boolean;
    page: string;
    layout?: boolean;
}) => {
    const { cacheKey, loading = true, page, layout } = props;
    let fallback: JSX.Element | undefined;
    if (loading) {
        fallback = typeof loading === 'boolean' ? <Spinner name="Box" /> : loading;
    }
    const view = layout ? layouts[page] : pages[page];
    return loadable(() => timeout(pMinDelay(view(), 3), 220000), {
        cacheKey: () => cacheKey,
        fallback,
    });
};
