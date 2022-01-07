import { useState } from 'react';
import { useMedia, useUpdateEffect } from 'react-use';

export const useResponsiveMobileCheck = () => {
    const responsive = useMedia('(max-width: 575px)');
    const [isMobile, setMobile] = useState(responsive);
    useUpdateEffect(() => {
        setMobile(responsive);
    }, [responsive]);
    return isMobile;
};
