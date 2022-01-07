import { produce } from 'immer';
import { createInstance } from 'localforage';
import type { Reducer } from 'react';

import { DbActionType } from './constants';
import type {
    DbAction,
    StorageConfig,
    DbItem,
    TableItem,
    StorageState,
    TableConfig,
    StorageStoreType,
} from './types';

/**
 * @description 根据传入的配置生成一个正确的配置
 * @param        {DbItem<TableConfig>} db
 * @return       {DbItem<TableItem>}
 */
const createDb = produce<DbItem<TableConfig>>((db) => {
    const { tables, defaultTable, ...options } = db;
    db.tables = tables.map((t) => {
        if (t.instance) return t as TableItem;
        // 没有指定数据表所属实例则创建一个新的实例
        const instance = createInstance({
            name: db.name,
            storeName: t.name,
            description: t.description ?? db.description,
        });
        instance.config(options);
        return {
            ...t,
            instance,
        };
    });
    return db;
}) as (db: DbItem<TableConfig>) => DbItem<TableItem>;

export const fixStorage = (state: StorageConfig) => {
    if (!state.dbs) {
        state.dbs = [
            {
                name: 'default',
                tables: [{ name: 'app' }],
            },
        ];
    }
    if (!state.default) state.default = state.dbs[0].name;
    state.dbs = state.dbs
        .map((d) => {
            const tables = !d.tables || d.tables.length <= 0 ? [{ name: 'app' }] : d.tables;
            const defaultTable = d.defaultTable ?? tables[0].name;
            return { ...d, defaultTable, tables };
        })
        .map((d) => createDb(d));
    return state as StorageState;
};
/**
 * @description 获取数据库配置
 * @param        {StorageState} state
 * @param        {string} name
 * @return       {*}
 */
const getDb = (state: StorageState, name: string) => state.dbs.find((db) => db.name === name);
/**
 * @description 获取数据表配置
 * @param        {StorageState} state
 * @param        {string} dbname
 * @param        {string} name
 * @return       {*}
 */
const getTable = (state: StorageState, dbname: string, name: string) => {
    const db = getDb(state, dbname);
    return db && db.tables.find((t) => t.name === name);
};
/**
 * @description  操作数据表
 * @param        {*} produce
 * @return       {*}
 */
export const storageReducer: Reducer<StorageStoreType, DbAction> = produce((state, action) => {
    switch (action.type) {
        case DbActionType.ADD_DB:
            if (!getDb(state.config, action.config.name)) {
                state.config.dbs = [...state.config.dbs, action.config as DbItem<TableItem>];
                fixStorage(state.config);
            }
            break;
        case DbActionType.SET_DEFAULT_DB:
            if (state.config.default !== action.name && getDb(state.config, action.name))
                state.config.default = action.name;
            break;
        case DbActionType.DELETE_DB:
            state.config.dbs = state.config.dbs.filter((d) => d.name === action.name);
            fixStorage(state.config);
            break;
        case DbActionType.ADD_TABLE: {
            const dbname = action.dbname ?? state.config.default;
            state.config.dbs.forEach((db, index) => {
                if (db.name === dbname && !getTable(state.config, dbname, action.config.name)) {
                    state.config.dbs[index].tables.push(action.config as TableItem);
                }
            });
            fixStorage(state.config);
            break;
        }
        case DbActionType.DELETE_TABLE: {
            const dbname = action.dbname ?? state.config.default;
            state.config.dbs.forEach((db, index) => {
                if (getTable(state.config, dbname, action.name)) {
                    state.config.dbs[index].tables = db.tables.filter(
                        (t) => t.name !== action.name,
                    );
                }
            });
            fixStorage(state.config);
            break;
        }
        case DbActionType.SET_DEFAULT_TABLE: {
            const dbname = action.dbname ?? state.config.default;
            state.config.dbs.forEach((db, index) => {
                if (
                    db.defaultTable !== action.name &&
                    getTable(state.config, dbname, action.name)
                ) {
                    state.config.dbs[index].defaultTable = action.name;
                }
            });
            fixStorage(state.config);
            break;
        }
        default:
            fixStorage(state.config);
            break;
    }
});
