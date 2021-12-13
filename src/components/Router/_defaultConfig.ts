import type { RouterStore } from './types';

export const getDefaultStore: <M extends RecordNever>() => RouterStore<M> = () => ({
    signal: {
        setuped: false,
        shouldChange: false,
        canGenerate: false,
        generated: false,
    },
    routes: [],
    renders: [],
    names: {},
    config: {
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
    },
});
