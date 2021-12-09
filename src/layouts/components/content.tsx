import type { FC } from 'react';

import { useStorageState } from '@/components/Storage/hooks';

export const AppContent: FC = () => {
    const state = useStorageState();
    return (
        <div>
            {state &&
                state.dbs.map((d, index) => (
                    <ul key={index.toString()}>
                        {d.tables.map((t, k) => (
                            <li key={k.toString()}>{t.name}</li>
                        ))}
                    </ul>
                ))}
        </div>
    );
};
