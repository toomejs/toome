import { createInstance } from 'localforage';
import { Dispatch } from 'react';
/**
 * Storage的状态管理store
 */
export interface StorageStoreType {
    /** 当前数据池状态 */
    config: StorageState;
}
/**
 * Storage初始化配置
 */
export interface StorageConfig extends IConfig<DbConfig> {}
/**
 * Storage的状态
 */
export interface StorageState extends Required<IConfig<DbItem<TableItem>>> {}
/**
 * Storage的操作
 */
export interface StorageDispatch extends Dispatch<DbAction> {}
/**
 * 数据池操作类型
 */
export enum DbActionType {
    /** 初始化数据池 */
    SETUP = 'setup',
    /** 添加数据库 */
    ADD_DB = 'add_db',
    /** 删除数据库 */
    DELETE_DB = 'delete_db',
    /** 设置默认数据库 */
    SET_DEFAULT_DB = 'set_default_db',
    /** 给一个数据库添加数据表 */
    ADD_TABLE = 'add_table',
    /** 设置一个数据库的默认数据表 */
    SET_DEFAULT_TABLE = 'change_table',
    /** 删除数据表 */
    DELETE_TABLE = 'delete_table',
    /** 修复构建数据池 */
    FIX = 'fix',
}

/**
 * 数据库配置接口
 */
export interface DbConfig {
    /** 名称 */
    name: string;
    /** 默认数据表 */
    defaultTable?: string;
    /** 数据表 */
    tables?: Array<TableConfig>;
    /** 驱动 */
    driver?: string | string[];
    /** 大小 */
    size?: number;
    /** 版本 */
    version?: number;
    /** 描述 */
    description?: string;
}

/**
 * 数据库状态
 */
export interface DbItem<T extends TableConfig> extends Omit<DbConfig, 'defaultTable' | 'tables'> {
    /** 默认数据表 */
    defaultTable: string;
    /** 数据表状态列表 */
    tables: Array<T>;
}

/**
 * 数据表配置
 */
export interface TableConfig {
    /** 表名称 */
    name: string;
    /** 描述 */
    description?: string;
    /** 所属的数据库实例 */
    instance?: ReturnType<typeof createInstance>;
}

/**
 * 数据表状态
 */
export interface TableItem extends Omit<TableConfig, 'instance'> {
    /** 所属的数据库实例 */
    instance: ReturnType<typeof createInstance>;
}

export type DbAction =
    | {
          type: DbActionType.ADD_DB;
          /** 数据库配置 */
          config: DbConfig;
      }
    | {
          type: DbActionType.SET_DEFAULT_DB;
          /** 数据库名 */
          name: string;
      }
    | {
          type: DbActionType.DELETE_DB;
          /** 数据表名 */
          name: string;
      }
    | {
          type: DbActionType.ADD_TABLE;
          /** 数据表配置 */
          config: TableConfig;
          /** 数据库名 */
          dbname?: string;
      }
    | {
          type: DbActionType.SET_DEFAULT_TABLE;
          /** 数据表名 */
          name: string;
          /** 数据库名 */
          dbname?: string;
      }
    | {
          type: DbActionType.DELETE_TABLE;
          /** 数据表名 */
          name: string;
          /** 数据库名 */
          dbname?: string;
      }
    | { type: DbActionType.FIX };
/**
 * Storage的配置参数
 */
interface IConfig<T extends DbConfig> {
    /** 默认数据库 */
    default?: string;
    /** 数据库列表 */
    dbs?: T[];
}
