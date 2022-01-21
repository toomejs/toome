import ReactDOM from 'react-dom';
import { equals, isNil, filter, map, findIndex } from 'ramda';
import { useUpdate, useUpdateEffect } from 'ahooks';
import {
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';

import { matchRoutes, useLocation, useNavigate, useOutlet } from 'react-router-dom';

import { useDeepCompareMemo } from '@/utils';

import { RouteComponentProps, RouterStore } from '../Router';

import { AlivePageProps } from './types';
import { AliveActionType, KeepAliveDispatchContext, KeepAliveIdContext } from './constants';
import { KeepAliveStore } from './store';

interface ParentRef {
    refresh: (resetId: string) => void;
}
const KeepOutlet: FC<{ id: string }> = ({ id }) => {
    const outlet = useOutlet();
    return useMemo(
        () => <KeepAliveIdContext.Provider value={id}>{outlet}</KeepAliveIdContext.Provider>,
        [],
    );
};
// 渲染 当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
const KeepPage: FC<AlivePageProps> = ({ isActive, children, id, renderDiv }) => {
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

const KeepContainer = forwardRef<ParentRef, { active: string; reset: string | null }>(
    ({ active, reset }, ref) => {
        const { exclude, include, maxLen } = KeepAliveStore(
            useCallback((state) => ({ ...state }), []),
        );
        const redo = useRef<number | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const pages = useRef<
            Array<{
                id: string;
                component: ReactNode;
            }>
        >([]);
        const update = useUpdate();
        useImperativeHandle(
            ref,
            () => ({
                refresh: (resetId) => {
                    if (!isNil(resetId) && isNil(redo.current)) {
                        redo.current = findIndex((item) => item.id === resetId, pages.current);
                        pages.current = pages.current.filter(({ id }) => !equals(id, resetId));
                    }
                },
            }),
            [],
        );
        useLayoutEffect(() => {
            if (isNil(reset) || isNil(redo.current)) return;
            pages.current.splice(redo.current, 0, {
                id: reset,
                component: <KeepOutlet id={reset} />,
            });
            redo.current = null;
            update();
        }, [reset]);
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
                        component: <KeepOutlet id={active} />,
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
        }, [active, exclude, maxLen, include]);
        return (
            <>
                <div ref={containerRef} className="keep-alive" />
                {map(
                    ({ id, component }) => (
                        <KeepPage
                            isActive={equals(id, active)}
                            renderDiv={containerRef}
                            id={id}
                            key={id}
                        >
                            {component}
                        </KeepPage>
                    ),
                    pages.current,
                )}
            </>
        );
    },
);

export const KeepAlive: FC<{ route: RouteComponentProps }> = ({ route, children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { path, notFound, reset } = KeepAliveStore(useCallback((state) => ({ ...state }), []));
    const [isRoot, setIsRoot] = useState(true);
    const [resetId, setResetId] = useState<string | null>(null);
    const ref = useRef<ParentRef | null>(null);
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
    useUpdateEffect(() => {
        setResetId(reset);
        if (isNil(reset)) return;
        ref.current && ref.current.refresh(reset);
        KeepAliveStore.dispatch({
            type: AliveActionType.RESET,
            params: { id: null },
        });
    }, [reset]);
    return isRoot || isNil(matchRouteId) ? (
        <>{children}</>
    ) : (
        <KeepAliveDispatchContext.Provider value={KeepAliveStore.dispatch}>
            <KeepContainer active={matchRouteId} reset={resetId} ref={ref} />
        </KeepAliveDispatchContext.Provider>
    );
};
