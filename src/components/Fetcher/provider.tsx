import { SWRConfig } from 'swr';

import { FetcherStore } from './store';

export const SWRFetcher: FC = ({ children }) => {
    const swr = FetcherStore((state) => state.swr);
    return <SWRConfig value={swr}>{children}</SWRConfig>;
};
