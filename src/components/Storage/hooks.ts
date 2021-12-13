import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce from 'immer';
import { dropInstance } from 'localforage';
import { useCallback } from 'react';
import create from 'zustand';
import { redux } from 'zustand/middleware';

import { DbActionType } from './constants';

import type { DbConfig, StorageConfig, StorageStore, TableConfig } from './types';
import { fixStorage, storageReducer } from './utils';

const useStore = create(
    redux(storageReducer, { setuped: false, doF: false, config: fixStorage({}) }),
);
export const useSetupStorage = (config?: StorageConfig) => {
    useStore.dispatch({ type: DbActionType.SETUP, config });
};
export const useStorageStore = createSelectorHooks(useStore);
export const useStorage = () => {
    const getDb = useCallback((name?: string) => {
        const { config } = useStore.getState();
        const dbname = name ?? config.default;
        return config.dbs.find((db) => db.name === dbname);
    }, []);
    const getTable = useCallback((name?: string, dbname?: string) => {
        const { config } = useStore.getState();
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
        const table = getTable(tablename, dbname);
        return table && table.instance;
    }, []);
    const addDb = useCallback(
        (options: DbConfig) => useStore.dispatch({ type: DbActionType.ADD_DB, config: options }),
        [],
    );
    const removeDb = useCallback(async (name: string) => {
        const db = getDb(name);
        if (db) {
            await Promise.all(
                db.tables.map(async (t) => dropInstance({ name: db.name, storeName: t.name })),
            );
        }
        useStore.dispatch({ type: DbActionType.DELETE_DB, name });
    }, []);
    const addTable = useCallback((options: TableConfig, dbname?: string) => {
        useStore.dispatch({ type: DbActionType.ADD_TABLE, config: options, dbname });
    }, []);
    const removeTable = useCallback(async (name: string, dbname?: string) => {
        const { config } = useStore.getState();
        const dname = dbname ?? config.default;
        useStore.dispatch({ type: DbActionType.DELETE_TABLE, name, dbname: dname });
        if (getTable(name, dbname)) await dropInstance({ name: dname, storeName: name });
    }, []);
    const doIn = useCallback(() => {
        useStore.setState(
            produce((state: StorageStore) => {
                state.doF = !state.doF;
            }),
        );
    }, []);
    return {
        doIn,
        getDb,
        getInstance,
        getTable,
        addDb,
        removeDb,
        addTable,
        removeTable,
    };
};
