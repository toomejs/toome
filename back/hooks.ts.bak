import { useCreation } from 'ahooks';
import { dropInstance } from 'localforage';
import { createContext, useCallback, useContext } from 'react';

import { DbActionType } from './constants';

import type { DbConfig, StorageConfig, StorageDispatch, StorageState, TableConfig } from './types';

export const StorageConfigContext = createContext<StorageConfig>({});
export const StorageStateContext = createContext<StorageState | null>(null);
export const StorageDispatchContext = createContext<StorageDispatch | null>(null);
export const useDb = () => {
    const state = useContext(StorageStateContext);
    return useCallback((name?: string) => {
        if (!state) return undefined;
        const dbname = name ?? state.default;
        return state.dbs.find((db) => db.name === dbname);
    }, []);
};
export const useAddDb = () => {
    const dispatch = useContext(StorageDispatchContext);
    useCallback(
        (options: DbConfig) => dispatch && dispatch({ type: DbActionType.ADD_DB, config: options }),
        [],
    );
};
export const useRemoveDb = () => {
    const dispatch = useContext(StorageDispatchContext);
    const getDb = useDb();
    return useCallback(async (name: string) => {
        if (dispatch) {
            const db = getDb(name);
            if (db) {
                await Promise.all(
                    db.tables.map(async (t) => dropInstance({ name: db.name, storeName: t.name })),
                );
            }
            dispatch({ type: DbActionType.DELETE_DB, name });
        }
    }, []);
};
export const useTable = () => {
    const state = useContext(StorageStateContext);
    return useCallback((name?: string, dbname?: string) => {
        if (!state) return undefined;
        const dname = dbname ?? state.default;
        const db = state.dbs.find((d) => d.name === dname);
        return (
            db &&
            db.tables.find((t) => {
                const tname = name ?? db.defaultTable;
                return t.name === tname;
            })
        );
    }, []);
};
export const useAddTable = () => {
    const dispatch = useContext(StorageDispatchContext);
    return useCallback((options: TableConfig, dbname?: string) => {
        if (dispatch) {
            dispatch({ type: DbActionType.ADD_TABLE, config: options, dbname });
        }
    }, []);
};
export const useRemoveTable = () => {
    const state = useContext(StorageStateContext);
    const dispatch = useContext(StorageDispatchContext);
    const getTable = useTable();
    return useCallback(async (name: string, dbname?: string) => {
        if (state && dispatch) {
            const dname = dbname ?? state.default;
            dispatch({ type: DbActionType.DELETE_TABLE, name, dbname: dname });
            if (getTable(name, dbname)) await dropInstance({ name: dname, storeName: name });
        }
    }, []);
};
export const useStorage = () => {
    const state = useContext(StorageStateContext);
    const getTable = useTable();
    return useCallback((tablename?: string, dbname?: string) => {
        if (!state) return undefined;
        const table = getTable(tablename, dbname);
        return table && table.instance;
    }, []);
};
export const useStorageState = () => {
    const state = useContext(StorageStateContext);
    return useCreation(() => state, [state]);
};
