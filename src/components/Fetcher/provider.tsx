import type { AxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';

import { deepMerge } from '@/utils';

import { useFetcher } from './hooks';

import { FetcherStore } from './store';

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
