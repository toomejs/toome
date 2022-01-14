import { AxiosInstance } from 'axios';

import { isArray } from 'lodash-es';

import { getUser } from '@/components/Auth';

import { RouterStatus, RouterStore } from '../../store';

import { RouteOption } from '../../types';

import { filteAccessRoutes, filteWhiteList } from './filter';
import { factoryItems, factoryRenders, factoryFinalRoutes, generateRenders } from './generate';

export { factoryItems, factoryRenders, factoryFinalRoutes, generateRenders };
/**
 * 构建用户生成路由渲染的路由列表
 * @param fetcher 远程Request对象
 */
export const factoryRoutes = async (fetcher: AxiosInstance) => {
    const user = getUser();
    const { config } = RouterStore.getState();
    RouterStatus.setState((state) => ({ ...state, next: false, success: false }));
    // 如果没有启用auth功能则使用配置中路由直接开始生成
    if (!config.auth.enabled) {
        RouterStore.setState((state) => {
            state.routes = [...state.config.routes.constants, ...state.config.routes.dynamic];
        });
        factoryItems();
    } else if (user) {
        // 如果用户已登录,首先过滤精通路由
        RouterStore.setState((state) => {
            state.routes = filteAccessRoutes(user, state.config.routes.constants, config.auth, {
                basePath: config.basePath,
            });
        });
        if (!config.server) {
            // 如果路由通过配置生成则直接过滤动态路由并合并已过滤的静态路由
            RouterStore.setState((state) => {
                state.routes = filteAccessRoutes(
                    user,
                    [...state.routes, ...state.config.routes.dynamic],
                    config.auth,
                    {
                        basePath: config.basePath,
                    },
                );
            });
            factoryItems();
        } else {
            try {
                // 如果路由通过服务器生成则直接合并已过滤的动态路由(权限过滤由服务端搞定)
                const { data } = await fetcher.get<RouteOption[]>(config.server);
                if (isArray(data)) {
                    RouterStore.setState((state) => {
                        state.routes = [...state.routes, ...data];
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        // 如果没有登录用户则根据白名单和路由项中的access为false来生成路由
        RouterStore.setState((state) => {
            state.routes = [
                ...filteWhiteList(state.config.routes.constants, config.auth, {
                    basePath: config.basePath,
                }),
                ...filteWhiteList(state.config.routes.dynamic, config.auth, {
                    basePath: config.basePath,
                }),
            ];
        });
        factoryItems();
        RouterStatus.setState((state) => ({ ...state, next: false }));
    }
};
