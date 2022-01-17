import ReactDOM from 'react-dom';
import { equals, isNil, filter, map } from 'ramda';
import { useUpdate } from 'ahooks';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { matchRoutes, useLocation, useNavigate, useOutlet } from 'react-router-dom';

import { useDeepCompareMemo } from '@/utils';

import { RouteComponentProps, RouterStore } from '../Router';

import { AlivePageProps } from './types';
import { AliveActionType, KeepAliveDispatchContext, KeepAliveIdContext } from './constants';
import { KeepAliveStore } from './store';

type PageComponentType = React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
export const KeepAlive: FC<{ render: PageComponentType }> = memo(({ render }) => {
    const { active, exclude, include, maxLen } = KeepAliveStore(
        useCallback((state) => ({ ...state }), []),
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const pages = useRef<Array<{ id: string; component: PageComponentType }>>([]);
    const update = useUpdate();
    useLayoutEffect(() => {
        if (isNil(active)) return;
        // 缓存超过上限的 干掉第一个缓存
        if (pages.current.length >= maxLen) {
            pages.current = pages.current.slice(1);
        }
        // 如果当前激活的标签页不在pages中则添加它
        const page = pages.current.find((item) => equals(item.id, active));
        if (isNil(page)) {
            pages.current = [
                ...pages.current,
                {
                    id: active,
                    component: render,
                },
            ];
            update();
        }
        // eslint-disable-next-line consistent-return
        return () => {
            // 处理 黑白名单
            if (isNil(exclude) && isNil(include)) return;
            pages.current = filter(({ id }) => {
                if (exclude && exclude.includes(id)) return false;
                if (include) return include.includes(id);
                return true;
            }, pages.current);
        };
    }, [render, active, exclude, maxLen, include, update]);
    return (
        <>
            <div ref={containerRef} className="keep-alive" />
            {map(
                ({ id, component }) => (
                    <AlivePage
                        isActive={equals(id, active)}
                        renderDiv={containerRef}
                        id={id}
                        key={id}
                    >
                        {component}
                    </AlivePage>
                ),
                pages.current,
            )}
        </>
    );
});

// 渲染 当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
const AlivePage: FC<AlivePageProps> = ({ isActive, children, id, renderDiv }) => {
    const [targetElement] = useState(() => document.createElement('div'));
    const activatedRef = useRef(false);
    activatedRef.current = activatedRef.current || isActive;
    // 根据当前页面是否被激活来移除页面的DOM
    useEffect(() => {
        if (isActive) {
            renderDiv.current?.appendChild(targetElement);
        } else {
            try {
                renderDiv.current?.removeChild(targetElement);
                // eslint-disable-next-line no-empty
            } catch (e) {}
        }
    }, [isActive, id, renderDiv, targetElement]);
    useEffect(() => {
        // 添加一个id 作为标识 并没有什么太多作用
        targetElement.setAttribute('id', id);
    }, [id, targetElement]);
    // 如果处于激活状态则把vnode渲染到document.createElement('div') 里面
    return <>{activatedRef.current && ReactDOM.createPortal(children, targetElement)}</>;
};

export const KeepAliveContainer: FC<{ route: RouteComponentProps }> = ({ route, children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { path, notFound } = KeepAliveStore(useCallback((state) => ({ ...state }), []));
    const [isRoot, setIsRoot] = useState(true);
    const outlet = useOutlet();
    // 计算 匹配的路由id
    const matchRouteId = useDeepCompareMemo(() => {
        const { renders, flats } = RouterStore.getState();
        const matches = matchRoutes(renders, location, route.path.base);
        if (isNil(matches) || matches.length < 1) return null;
        const match = matches[matches.length - 1];
        const item = flats.find((f) => f.id === (match.route as any).id);
        if (!item) return null;
        return item.id;
    }, [route, location]);
    const render = useMemo(
        () => (
            <KeepAliveIdContext.Provider value={matchRouteId}>{outlet}</KeepAliveIdContext.Provider>
        ),
        [matchRouteId],
    );
    // 缓存渲染 & 判断是否404
    useEffect(() => {
        const { flats } = RouterStore.getState();
        const matchItem = flats.find((item) => item.id === matchRouteId);
        const checkRoot = !!(
            matchItem &&
            matchItem.path === path &&
            (!matchItem.index || (matchItem.index && !matchItem.isPage))
        );
        setIsRoot(checkRoot);
        if (checkRoot) return;
        if (matchRouteId) {
            KeepAliveStore.dispatch({ type: AliveActionType.ADD, id: matchRouteId });
            KeepAliveStore.dispatch({ type: AliveActionType.ACTIVE, id: matchRouteId });
        } else if (!equals(location.pathname, path)) {
            navigate({ pathname: notFound });
        }
    }, [matchRouteId, location, navigate]);
    return isRoot ? (
        <>{children}</>
    ) : (
        <KeepAliveDispatchContext.Provider value={KeepAliveStore.dispatch}>
            <KeepAlive render={render} />
        </KeepAliveDispatchContext.Provider>
    );
};
