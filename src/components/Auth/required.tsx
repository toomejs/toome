import { trim } from 'lodash-es';
import type { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import type { AntdRouteOption, RouteOption } from '../Router';

import { useAuth } from './hooks';

export const RequirdAuth: FC<{
    route: RouteOption | AntdRouteOption;
    basename: string;
    path?: string;
    element: ReactElement;
}> = ({ route: { auth }, element, basename, path = '/auth/login' }) => {
    const location = useLocation();
    const { token } = useAuth();
    if (auth && token !== undefined) {
        let redirect = '';
        if (location.pathname !== path && trim(location.pathname, '/') !== trim(basename, '/')) {
            redirect = `?redirect=${location.pathname}`;
            if (location.search) redirect = `${redirect}${location.search}`;
        }
        return token ? element : <Navigate to={`${path}${redirect}`} replace />;
    }
    return element;
};
