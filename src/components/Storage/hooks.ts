import { dropInstance } from 'localforage';
import { useCallback } from 'react';

import { createSelectorHooks } from 'auto-zustand-selectors-hook';

import { useStoreSetuped } from '@/utils';

import { StorageSetup, StorageStore } from './store';

import { DbActionType, DbConfig, StorageConfig, TableConfig } from './types';
import { fixStorage } from './utils';

/**
 * Storage状态选择器
 */
export const useStorageStore = createSelectorHooks(StorageStore);

/**
 * Storage初始化钩子
 * @param config
 */
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

/**
 * Storage操作集
 */
export const useStorageDispatch = () => {
    const getDb = useCallback(
        /**
         * 获取一个数据库的状态
         * @param name 数据库名称,如果不填则为默认数据库
         */
        (name?: string) => {
            if (!StorageSetup.getState().setuped) return undefined;
            const { config } = StorageStore.getState();
            const dbname = name ?? config.default;
            return config.dbs.find((db) => db.name === dbname);
        },
        [],
    );

    const getTable = useCallback(
        /**
         * 获取一个数据表的状态
         * @param name 数据库名称,如果不填则为默认数据库
         * @param dbname 数据表名称,如果不填则为指定数据库的默认数据表
         */
        (name?: string, dbname?: string) => {
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
        },
        [],
    );
    const getInstance = useCallback(
        /**
         * 获取一个数据表连接实例
         * @param tablename 数据名称(如果不填则为指定数据库的默认数据表)
         * @param dbname 数据库名称(如果不填则为默认数据库)
         */
        (tablename?: string, dbname?: string) => {
            if (!StorageSetup.getState().setuped) return undefined;
            const table = getTable(tablename, dbname);
            return table && table.instance;
        },
        [],
    );
    const addDb = useCallback(
        /**
         * 添加一个数据库(如果存在则忽略)
         * @param options 数据库配置
         */
        (options: DbConfig) => {
            if (!StorageSetup.getState().setuped) return;
            StorageStore.dispatch({ type: DbActionType.ADD_DB, config: options });
        },
        [],
    );
    const removeDb = useCallback(
        /**
         * 删除一个数据库,并销毁其下的数据表连接实例
         * @param name 数据库名称
         */
        async (name: string) => {
            if (StorageSetup.getState().setuped) {
                const db = getDb(name);
                if (db) {
                    await Promise.all(
                        db.tables.map(async (t) =>
                            dropInstance({ name: db.name, storeName: t.name }),
                        ),
                    );
                }
                StorageStore.dispatch({ type: DbActionType.DELETE_DB, name });
            }
        },
        [],
    );
    const addTable = useCallback(
        /**
         * 添加一个数据表
         * @param options 数据表配置
         * @param dbname 添加到的数据库名(如不填则为默认数据库)
         */
        (options: TableConfig, dbname?: string) => {
            if (StorageSetup.getState().setuped) {
                StorageStore.dispatch({ type: DbActionType.ADD_TABLE, config: options, dbname });
            }
        },
        [],
    );
    const removeTable = useCallback(
        /**
         * 删除数据表并销毁其连接实例
         * @param name 数据表名
         * @param dbname 所属数据库名(如不填则为默认数据库)
         */
        async (name: string, dbname?: string) => {
            if (StorageSetup.getState().setuped) {
                const { config } = StorageStore.getState();
                const dname = dbname ?? config.default;
                StorageStore.dispatch({ type: DbActionType.DELETE_TABLE, name, dbname: dname });
                if (getTable(name, dbname)) await dropInstance({ name: dname, storeName: name });
            }
        },
        [],
    );
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
