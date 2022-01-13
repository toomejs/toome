import ReactDOM from 'react-dom';
import { equals, isNil, map, filter, not } from 'ramda';
import { useUpdate } from 'ahooks';
import { memo, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import {
    KeepAliveChildren,
    KeepAliveComponentProps,
    KeepAliveContextType,
    KeepAliveProps,
} from './types';
import { KeepAliveContext } from './constants';
import { reducer } from './utils';

export const KeepAlive: FC<KeepAliveProps> = memo((props) => {
    const { activeName, children, exclude, include, isAsyncInclude, maxLen = 10 } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const components = useRef<Array<{ name: string; ele: KeepAliveChildren }>>([]);
    const [asyncInclude] = useState<boolean>(isAsyncInclude);
    const update = useUpdate();
    useLayoutEffect(() => {
        if (isNil(activeName)) return;
        // 缓存超过上限的 干掉第一个缓存
        if (components.current.length >= maxLen) {
            components.current = components.current.slice(1);
        }
        // 添加
        const component = components.current.find((res) => equals(res.name, activeName));
        if (isNil(component)) {
            components.current = [
                ...components.current,
                {
                    name: activeName,
                    ele: children,
                },
            ];
            if (not(asyncInclude)) update();
        }
        // eslint-disable-next-line consistent-return
        return () => {
            // 处理 黑白名单
            if (isNil(exclude) && isNil(include)) return;
            components.current = filter(({ name }) => {
                if (exclude && exclude.includes(name)) return false;
                if (include) return include.includes(name);
                return true;
            }, components.current);
        };
    }, [children, activeName, exclude, maxLen, include, update, asyncInclude]);
    return (
        <>
            <div ref={containerRef} className="keep-alive" />
            {map(
                ({ name, ele }) => (
                    <Component
                        active={equals(name, activeName)}
                        renderDiv={containerRef}
                        name={name}
                        key={name}
                    >
                        {ele}
                    </Component>
                ),
                components.current,
            )}
        </>
    );
});

// 渲染 当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
const Component: FC<KeepAliveComponentProps> = ({ active, children, name, renderDiv }) => {
    const [targetElement] = useState(() => document.createElement('div'));
    const activatedRef = useRef(false);
    activatedRef.current = activatedRef.current || active;
    useEffect(() => {
        if (active) {
            // 渲染匹配的组件
            renderDiv.current?.appendChild(targetElement);
        } else {
            try {
                // 移除不渲染的组件
                renderDiv.current?.removeChild(targetElement);
                // eslint-disable-next-line no-empty
            } catch (e) {}
        }
    }, [active, name, renderDiv, targetElement]);
    useEffect(() => {
        // 添加一个id 作为标识 并没有什么太多作用
        targetElement.setAttribute('id', name);
    }, [name, targetElement]);
    // 把vnode 渲染到document.createElement('div') 里面
    return <>{activatedRef.current && ReactDOM.createPortal(children, targetElement)}</>;
};
export const KeepAliveComponent = memo(Component);
export const KeepAliveProvider: FC<{ value: KeepAliveContextType }> = ({ value, children }) => (
    <KeepAliveContext.Provider value={value}>{children}</KeepAliveContext.Provider>
);
export const KeepAliveContainer: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [keepAliveList, dispatch] = useReducer(reducer, []);
    // 生成子路由
    const routeObject = useMemo(() => {
        if (route.children) {
            return makeRouteObject(route.children, dispatch);
        }
        return [];
    }, [route.children]);
    return (
        <KeepAlive active={matchRouteObj?.key} include={include} isAsyncInclude>
            {ele}
        </KeepAlive>
    );
};
