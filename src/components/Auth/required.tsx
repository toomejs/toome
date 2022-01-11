import { trim } from 'lodash-es';
import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthInited, useToken } from './hooks';
/**
 * 该组件已废弃
 * @param param0
 */
export const RequirdAuth: FC<{
    basename: string;
    path?: string;
    element: ReactElement;
}> = ({ element, basename, path = '/auth/login' }) => {
    const location = useLocation();
    const token = useToken();
    const tokened = useAuthInited();
    if (tokened && token !== undefined) {
        let redirect = '';
        if (location.pathname !== path && trim(location.pathname, '/') !== trim(basename, '/')) {
            redirect = `?redirect=${location.pathname}`;
            if (location.search) redirect = `${redirect}${location.search}`;
        }
        return token ? element : <Navigate to={`${path}${redirect}`} replace />;
    }
    return element;
};
