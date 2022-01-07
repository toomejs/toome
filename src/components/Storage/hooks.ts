import { dropInstance } from 'localforage';
import { useCallback } from 'react';

import { createSelectorHooks } from 'auto-zustand-selectors-hook';

import { useStoreSetuped } from '@/utils';

import { DbActionType } from './constants';
import { StorageSetup, StorageStore } from './store';

import type { DbConfig, StorageConfig, TableConfig } from './types';
import { fixStorage } from './utils';

export const useStorageStore = createSelectorHooks(StorageStore);

export const useSetupStorage = (config?: StorageConfig) => {
    useStoreSetuped({
        store: StorageSetup,
        callback: () => {
            StorageStore.setState((state) => {
                state.config = fixStorage(config ?? {});
            });
        },
    });
};

export const useStorageDispatch = () => {
    const getDb = useCallback((name?: string) => {
        if (!StorageSetup.getState().setuped) return undefined;
        const { config } = StorageStore.getState();
        const dbname = name ?? config.default;
        return config.dbs.find((db) => db.name === dbname);
    }, []);
    const getTable = useCallback((name?: string, dbname?: string) => {
        if (!StorageSetup.getState().setuped) return undefined;
        const { config } = StorageStore.getState();
        const dname = dbname ?? config.default;
        const db = config.dbs.find((d) => d.name === dname);
        return (
            db &&
            db.tables.find((t) => {
                const tname = name ?? db.defaultTable;
                return t.name === tname;
            })
        );
    }, []);
    const getInstance = useCallback((tablename?: string, dbname?: string) => {
        if (!StorageSetup.getState().setuped) return undefined;
        const table = getTable(tablename, dbname);
        return table && table.instance;
    }, []);
    const addDb = useCallback((options: DbConfig) => {
        if (!StorageSetup.getState().setuped) return;
        StorageStore.dispatch({ type: DbActionType.ADD_DB, config: options });
    }, []);
    const removeDb = useCallback(async (name: string) => {
        if (StorageSetup.getState().setuped) {
            const db = getDb(name);
            if (db) {
                await Promise.all(
                    db.tables.map(async (t) => dropInstance({ name: db.name, storeName: t.name })),
                );
            }
            StorageStore.dispatch({ type: DbActionType.DELETE_DB, name });
        }
    }, []);
    const addTable = useCallback((options: TableConfig, dbname?: string) => {
        if (StorageSetup.getState().setuped) {
            StorageStore.dispatch({ type: DbActionType.ADD_TABLE, config: options, dbname });
        }
    }, []);
    const removeTable = useCallback(async (name: string, dbname?: string) => {
        if (StorageSetup.getState().setuped) {
            const { config } = StorageStore.getState();
            const dname = dbname ?? config.default;
            StorageStore.dispatch({ type: DbActionType.DELETE_TABLE, name, dbname: dname });
            if (getTable(name, dbname)) await dropInstance({ name: dname, storeName: name });
        }
    }, []);
    return {
        getDb,
        getInstance,
        getTable,
        addDb,
        removeDb,
        addTable,
        removeTable,
    };
};
