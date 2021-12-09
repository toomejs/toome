import type { RouterState } from './types';

export const getDefaultState: <M extends Record<string, any>>() => RouterState<M> = () => ({
    basePath: '/',
    hash: false,
    server: null,
    auth: {
        enabled: true,
        login_path: '/auth/login',
        white_list: [],
        role_column: 'name',
        permission_column: 'name',
        redirect: 'login',
    },
    permission: {
        enabled: true,
        column: 'name',
    },
    routes: {
        constants: [],
        dynamic: [],
    },
});
