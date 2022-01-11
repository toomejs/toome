/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-25 07:26:27 +0800
 * Updated_at     : 2022-01-10 10:15:56 +0800
 * Path           : /src/components/Fetcher/provider.tsx
 * Description    : SWR包装器
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import type { AxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';

import { deepMerge } from '@/utils';

import { useFetcher } from './hooks';

import { FetcherStore } from './store';
/**
 * SWR包装器,如果要使用swr功能请使用此组件包裹根组件
 * @param props
 */
export const SWRFetcher: FC = ({ children }) => {
    const swr = FetcherStore((state) => state.swr);
    const fetcher = useFetcher();
    useEffect(() => {
        FetcherStore.setState((state) => {
            state.swr = {
                ...(state.swr ?? {}),
                fetcher: async (
                    resource: string | AxiosRequestConfig,
                    options?: AxiosRequestConfig,
                ) => {
                    let config: AxiosRequestConfig = options ?? {};
                    if (typeof resource === 'string') config.url = resource;
                    else config = deepMerge(config, resource, 'replace');
                    const res = await fetcher.request({ ...config, method: 'get' });
                    await new Promise((resolve) => {
                        setTimeout(resolve, 3000);
                    });
                    return res.data;
                },
            };
        });
    }, [fetcher]);
    return <SWRConfig value={swr}>{children}</SWRConfig>;
};
