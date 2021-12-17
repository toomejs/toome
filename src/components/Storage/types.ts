import type { createInstance } from 'localforage';
import type { Dispatch } from 'react';

import type { DbActionType } from './constants';

/**
 * @description 外部传入的存储配置
 * @interface IConfig
 * @template T
 */
interface IConfig<T extends DbConfig> {
    default?: string;
    dbs?: T[];
}

/**
 * @description 数据表配置
 * @export
 * @interface TableConfig
 */
export interface TableConfig {
    // 表名称
    name: string;
    // 描述
    description?: string;
    // 所属的数据库实例
    instance?: ReturnType<typeof createInstance>;
}

/**
 * @description 数据表配置参数
 * @export
 * @interface TableItem
 * @extends {Omit<TableConfig, 'instance'>}
 */
export interface TableItem extends Omit<TableConfig, 'instance'> {
    instance: ReturnType<typeof createInstance>;
}

/**
 * @description 数据库配置
 * @export
 * @interface DbConfig
 */
export interface DbConfig {
    name: string;
    defaultTable?: string;
    tables?: Array<TableConfig>;
    driver?: string | string[];
    size?: number;
    version?: number;
    description?: string;
}

/**
 * @description 数据库实例配置
 * @export
 * @interface DbItem
 * @extends {(Omit<DbConfig, 'defaultTable' | 'tables'>)}
 * @template T
 */
export interface DbItem<T extends TableConfig> extends Omit<DbConfig, 'defaultTable' | 'tables'> {
    defaultTable: string;
    tables: Array<T>;
}

export interface StorageConfig extends IConfig<DbConfig> {}
export interface StorageState extends Required<IConfig<DbItem<TableItem>>> {}
export interface StorageDispatch extends Dispatch<DbAction> {}
export type DbAction =
    | { type: DbActionType.SETUP; config?: StorageConfig }
    | { type: DbActionType.ADD_DB; config: DbConfig }
    | { type: DbActionType.SET_DEFAULT_DB; name: string }
    | { type: DbActionType.DELETE_DB; name: string }
    | { type: DbActionType.ADD_TABLE; config: TableConfig; dbname?: string }
    | { type: DbActionType.SET_DEFAULT_TABLE; name: string; dbname?: string }
    | { type: DbActionType.DELETE_TABLE; name: string; dbname?: string }
    | { type: DbActionType.FIX };

export interface StorageStore {
    setuped: boolean;
    doF: boolean;
    config: StorageState;
}
