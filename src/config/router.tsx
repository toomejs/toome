import type { RouteOption, RouterConfig } from '@/components/Router';
import { Loading, Spinner } from '@/components/Spinner';

import { auth, content, dashboard, errors } from './routes';

const RouteLoading = () => {
    return (
        <Loading
            className="bg-white/80 dark:bg-black/70 -ml-2 -mt-2 w-[calc(100%_+_theme(space.4))] h-[calc(100%_+_theme(space.4))]"
            component={<Spinner name="Coffee" darkColor="rgb(252, 193, 105)" />}
        />
    );
};
const addLoading = (routes: RouteOption[]): RouteOption[] => {
    return routes.map((item) => {
        const data = {
            ...item,
            loading: RouteLoading,
        };
        if (data.children) data.children = addLoading([...data.children]);
        return data;
    });
};
const constants: RouteOption[] = [...auth, ...errors];
const dynamic: RouteOption[] = [
    {
        path: '/',
        page: 'master',
        access: true,
        layout: true,
        children: addLoading([...dashboard, ...content]),
    },
];

export const router: RouterConfig = {
    basePath: import.meta.env.BASE_URL,
    window: undefined,
    hash: false,
    routes: {
        constants,
        dynamic,
    },
};
