/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-29 11:55:02 +0800
 * @Updated_at     : 2022-01-10 14:01:20 +0800
 * @Path           : /src/components/Config/types.ts
 * @Description    : 配置组件类型
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import DarkReader from 'darkreader';

import { ThemeDepend, ThemeMode } from './constants';

/**
 * 配置组件参数选项
 */
export interface ConfigProps {
    /** 默认时区 */
    timezone?: string;
    /** 主题配置 */
    theme?: ThemeConfig;
    /** 色系配置 */
    colors?: ColorConfig;
    // layout?: LayoutConfig;
}
/**
 * 配置组件状态池
 */
export interface ConfigStoreType {
    /** 配置状态 */
    config: ReRequired<Omit<ConfigProps, 'theme'>> & {
        /** 主题配置 */
        theme: ReRequired<Omit<ThemeConfig, 'darken'>> & {
            /** DarkReader配置 */
            darken?: DarkReaderConfig;
        };
    };
    /** 监听器 */
    watchers: {
        /** 主题切换依赖监听器 */
        theme?: NodeJS.Timeout;
    };
}
/**
 * 主题配置
 */
export interface ThemeConfig {
    /** 主题模式 */
    mode?: `${ThemeMode}`;
    /** 主题依赖,注意OS和TIME与手动切换并不冲突,但OS与TIME两者只能选择一个 */
    depend?: `${ThemeDepend}`;
    /** 切换时间 */
    range?: Partial<ThemeTimeRange>;
    /** DarkRender配置 */
    darken?: DarkReaderConfig;
}
/**
 * 色系配置
 */
export interface ColorConfig {
    /** 主色 */
    primary?: string;
    /** 信息色 */
    info?: string;
    /** 成功色 */
    success?: string;
    /** 错误色 */
    error?: string;
    /** 警告色 */
    warning?: string;
}

// export interface LayoutConfig {
//     mode?: `${LayoutMode}`;
//     collapsed?: boolean;
//     theme?: Partial<LayoutTheme>;
//     fixed?: Partial<LayoutFixed>;
// }
/**
 * 主题切换时间范围
 */
export type ThemeTimeRange = { [key in `${ThemeMode}`]: string };
/**
 * DarkReader配置
 */
export interface DarkReaderConfig {
    theme?: Partial<DarkReader.Theme>;
    fixes?: Partial<DarkReader.DynamicThemeFix>;
}

// export type LayoutTheme = { [key in `${LayoutComponent}`]: `${ThemeMode}` };
// export type LayoutFixed = { [key in `${LayoutComponent}`]: boolean };
