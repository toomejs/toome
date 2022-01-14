import { useUnmount } from 'ahooks';

import { RouteItem, RouterStore } from '../Router';

import { KeepAliveSetup } from './store';

import { KeepAliveProvider } from './view';

const getRouteItems = (routes: RouteItem[]) =>
    routes.map((item) => {
        const route: RouteItem = { ...item };
        if (route.isRoute) {
            route.component = (props) => (
                <KeepAliveProvider value={{ name: item.id }}>
                    <route.component {...props} />
                </KeepAliveProvider>
            );
        }
        if (route.children) route.children = getRouteItems(route.children);
        return route;
    });
export const useSetupKeepAlive = (path: string) => {
    const listenRouteItems = RouterStore.subscribe(
        (state) => state.items,
        (items) => {
            if (KeepAliveSetup.getState().setuped) return;
            KeepAliveSetup.setState((state) => {
                state.setuped = true;
            });
            const routes = items.map((item) => {
                if (item.isRoute && item.children && item.path.absolute === path) {
                    return { ...item, children: getRouteItems(item.children) };
                }
                return item;
            });
            RouterStore.setState((state) => {
                state.items = routes;
            });
        },
    );
    useUnmount(() => {
        listenRouteItems();
    });
};
