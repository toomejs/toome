import { deepMerge, useStoreSetuped } from '@/utils';

import { KeepAliveSetup, KeepAliveStore } from './store';

import { KeepAliveConfig } from './types';

export const useSetupKeepAlive = (config: KeepAliveConfig) => {
    useStoreSetuped({
        store: KeepAliveSetup,
        callback: () => {
            KeepAliveStore.setState((state) => deepMerge(state, config, 'replace'), true);
        },
    });
    const listenLives = KeepAliveStore.subscribe(
        (state) => state.lives,
        (lives) => {
            KeepAliveStore.setState((state) => {
                state.include = lives;
            });
        },
    );
    // const listenRouteOptions = RouterStore.subscribe(
    //     (state) => state.routes,
    //     () => {
    //         KeepAliveSetup.setState((state) => {
    //             state.generated = undefined;
    //         });
    //     },
    // );
    // const listenRouteItems = RouterStore.subscribe(
    //     (state) => state.items,
    //     (items) => {
    //         if (KeepAliveSetup.getState().generated) return;
    //         KeepAliveSetup.setState((state) => {
    //             state.generated = true;
    //         });
    //         const { path } = KeepAliveStore.getState();
    //         const routes = items.map((item) => {
    //             if (item.isRoute && item.children && item.path.absolute === path) {
    //                 return { ...item, children: getRouteItems(item.children) };
    //             }
    //             return item;
    //         });
    //         RouterStore.setState((state) => {
    //             state.items = routes;
    //         });
    //     },
    // );
    // useUnmount(() => {
    // listenRouteOptions();
    // listenRouteItems();
    // });
};

// const getRouteItems = (routes: RouteItem[]) =>
//     routes.map((item) => {
//         const route: RouteItem = { ...item };
//         if (route.isRoute) {
//             route.component = (props) => {
//                 return (
//                     <KeepAliveProvider value={{ id: item.id }}>
//                         <route.component {...props} />
//                     </KeepAliveProvider>
//                 );
//             };
//         }
//         if (route.children) route.children = getRouteItems(route.children);
//         return route;
//     });
