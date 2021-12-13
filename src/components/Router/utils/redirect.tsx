import type { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const AuthRedirect: FC<{
    loginPath?: string;
}> = ({ loginPath }) => {
    const location = useLocation();
    let redirect = `?redirect=${location.pathname}`;
    if (location.search) redirect = `${redirect}${location.search}`;
    return <Navigate to={`${loginPath}${redirect}`} replace />;
};
