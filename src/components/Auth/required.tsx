import { trim } from 'lodash-es';
import type { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useToken } from './hooks';

export const RequirdAuth: FC<{
    basename: string;
    path?: string;
    element: ReactElement;
}> = ({ element, basename, path = '/auth/login' }) => {
    const location = useLocation();
    const token = useToken.useValue();
    const tokened = useToken.useSetuped();
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
