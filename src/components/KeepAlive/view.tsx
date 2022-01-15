import ReactDOM from 'react-dom';
import { equals, isNil, map, filter, not } from 'ramda';
import { useUpdate } from 'ahooks';
import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { matchRoutes, useLocation, useNavigate } from 'react-router-dom';

import { useDeepCompareMemo } from '@/utils';

import { RouteComponentProps, RouterStore } from '../Router';

import { AlivePageProps, KeepAliveContextType } from './types';
import { AliveActionType, KeepAliveContext, KeepAliveDispatchContext } from './constants';
import { KeepAliveStore } from './store';

export const KeepAlive: FC<{ isAsyncInclude: boolean }> = memo((props) => {
    const { active, exclude, include, maxLen } = KeepAliveStore(
        useCallback((state) => ({ ...state }), []),
    );
    const { children, isAsyncInclude } = props;
    const dispatchContext = useContext(KeepAliveDispatchContext);
    const dispatch = isNil(dispatchContext) ? undefined : dispatchContext.dispatch;
    const containerRef = useRef<HTMLDivElement>(null);
    const pages = useRef<Array<{ id: string; ele: any }>>([]);
    const [asyncInclude] = useState<boolean>(isAsyncInclude);
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
                    ele: children,
                },
            ];
            if (not(asyncInclude)) update();
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
    }, [children, active, exclude, maxLen, include, update, asyncInclude]);
    return (
        <>
            <div ref={containerRef} className="keep-alive" />
            {map(
                ({ id, ele }) => (
                    <AlivePage
                        isActive={equals(id, active)}
                        renderDiv={containerRef}
                        id={id}
                        key={id}
                    >
                        <KeepAliveProvider value={{ id, dispatch }}>{ele}</KeepAliveProvider>
                    </AlivePage>
                ),
                pages.current,
            )}
        </>
    );
});

// 渲染 当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
const AlivePage: FC<AlivePageProps> = memo(({ isActive, children, id, renderDiv }) => {
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
});
export const KeepAliveProvider: FC<{ value: KeepAliveContextType }> = ({ value, children }) => (
    <KeepAliveContext.Provider value={value}>{children}</KeepAliveContext.Provider>
);

export const KeepAliveContainer: FC<{ route: RouteComponentProps }> = ({ route, children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { path, notFound, lives } = KeepAliveStore(useCallback((state) => ({ ...state }), []));
    const [isRoot, setIsRoot] = useState(true);
    // // 计算 匹配的路由id
    const matchRouteId = useDeepCompareMemo(() => {
        const { renders, flats } = RouterStore.getState();
        const matches = matchRoutes(renders, location, route.path.base);
        if (isNil(matches) || matches.length < 1) return null;
        const match = matches[matches.length - 1];
        const item = flats.find((f) => f.id === (match.route as any).id);
        if (!item) return null;
        return item.id;
    }, [route, location]);
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
        } else if (!equals(location.pathname, path)) {
            navigate({ pathname: notFound });
        }
    }, [matchRouteId, location, navigate]);
    const dispatchValue = useMemo(() => ({ dispatch }), [dispatch]);
    return isRoot ? (
        <>{children}</>
    ) : (
        <KeepAliveDispatchContext.Provider value={dispatchValue}>
            <KeepAlive isAsyncInclude>{children}</KeepAlive>
        </KeepAliveDispatchContext.Provider>
    );
};
