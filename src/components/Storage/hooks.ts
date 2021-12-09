/* eslint-disable autofix/no-unused-vars */
import { useCreation } from 'ahooks';
import { dropInstance } from 'localforage';
import { useCallback, useMemo } from 'react';
import create from 'zustand';
import { redux } from 'zustand/middleware';

import { createImmer } from '@/utils/store';

import { DbActionType } from './constants';

import type { DbConfig, StorageConfig, TableConfig } from './types';
import { initStorage, storageReducer } from './utils';

const useInitStore = createImmer<{ inited: boolean }>(
    () => ({ inited: false } as { inited: boolean }),
);
const { getState, setState, dispatch } = create(redux(storageReducer, initStorage({})));
export const useStorageInit = (config?: StorageConfig) => {
    const inited = useInitStore((state) => state.inited);
    if (!inited) {
        setState(() => initStorage(config ?? {}), true);
        useInitStore.setState((draft) => {
            draft.inited = true;
        });
    }
    return useMemo(() => inited, [inited]);
};

export const useStorageState = () => {
    const state = getState();
    return useCreation(() => state, [state]);
};

export const useStorage = () => {
    const getDb = useCallback((name?: string) => {
        const state = getState();
        const dbname = name ?? state.default;
        return state.dbs.find((db) => db.name === dbname);
    }, []);
    const getTable = useCallback((name?: string, dbname?: string) => {
        const state = getState();
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
    const getInstance = useCallback((tablename?: string, dbname?: string) => {
        const table = getTable(tablename, dbname);
        return table && table.instance;
    }, []);
    return { getDb, getTable, getInstance };
};
export const useStorageMutation = () => {
    const { getDb, getTable } = useStorage();
    const addDb = useCallback(
        (options: DbConfig) => dispatch({ type: DbActionType.ADD_DB, config: options }),
        [],
    );
    const removeDb = useCallback(async (name: string) => {
        const db = getDb(name);
        if (db) {
            await Promise.all(
                db.tables.map(async (t) => dropInstance({ name: db.name, storeName: t.name })),
            );
        }
        dispatch({ type: DbActionType.DELETE_DB, name });
    }, []);
    const addTable = useCallback((options: TableConfig, dbname?: string) => {
        dispatch({ type: DbActionType.ADD_TABLE, config: options, dbname });
    }, []);
    const removeTable = useCallback(async (name: string, dbname?: string) => {
        const state = getState();
        const dname = dbname ?? state.default;
        dispatch({ type: DbActionType.DELETE_TABLE, name, dbname: dname });
        if (getTable(name, dbname)) await dropInstance({ name: dname, storeName: name });
    }, []);
    return { addDb, removeDb, addTable, removeTable };
};
