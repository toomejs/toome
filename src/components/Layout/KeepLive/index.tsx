import ReactDOM from 'react-dom';
import { equals, isNil, map, filter, not } from 'ramda';
import { useUpdate } from 'ahooks';
import {
    JSXElementConstructor,
    memo,
    ReactElement,
    RefObject,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

type Children = ReactElement<any, string | JSXElementConstructor<any>> | null;
interface Props {
    activeName?: string;
    isAsyncInclude: boolean; // 是否异步添加 Include  如果不是又填写了 true 会导致重复渲染
    include?: Array<string>;
    exclude?: Array<string>;
    maxLen?: number;
    children: Children;
}
const KeepAlive = ({
    activeName,
    children,
    exclude,
    include,
    isAsyncInclude,
    maxLen = 10,
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const components = useRef<Array<{ name: string; ele: Children }>>([]);
    const [asyncInclude] = useState<boolean>(isAsyncInclude);
    const update = useUpdate();
    useLayoutEffect(() => {
        if (isNil(activeName)) {
            return;
        }
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
            if (not(asyncInclude)) {
                update();
            }
        }
        return () => {
            // 处理 黑白名单
            if (isNil(exclude) && isNil(include)) {
                return;
            }
            components.current = filter(({ name }) => {
                if (exclude && exclude.includes(name)) {
                    return false;
                }
                if (include) {
                    return include.includes(name);
                }
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
};
export default memo(KeepAlive);
interface ComponentProps {
    active: boolean;
    children: Children;
    name: string;
    renderDiv: RefObject<HTMLDivElement>;
}
// 渲染 当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
var Component = ({ active, children, name, renderDiv }: ComponentProps) => {
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
