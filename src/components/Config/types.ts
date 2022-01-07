import type DarkReader from 'darkreader';

import type { LayoutMode, ThemeDepend, ThemeMode, LayoutComponent } from './constants';

/**
 * 配置接口
 */
export interface ConfigProps {
    timezone?: string;
    theme?: ThemeConfig;
    colors?: ColorConfig;
    layout?: LayoutConfig;
}
export interface ConfigStoreType {
    config: ReRequired<Omit<ConfigProps, 'theme'>> & {
        theme: ReRequired<Omit<ThemeConfig, 'darken'>> & {
            darken?: DarkReaderConfig;
        };
    };
    watchers: {
        theme?: NodeJS.Timeout;
    };
}

export interface ThemeConfig {
    mode?: `${ThemeMode}`;
    depend?: `${ThemeDepend}`;
    range?: Partial<ThemeTimeRange>;
    darken?: DarkReaderConfig;
}
export interface ColorConfig {
    primary?: string;
    info?: string;
    success?: string;
    error?: string;
    warning?: string;
}

export interface LayoutConfig {
    mode?: `${LayoutMode}`;
    collapsed?: boolean;
    theme?: Partial<LayoutTheme>;
    fixed?: Partial<LayoutFixed>;
}

export type ThemeTimeRange = { [key in `${ThemeMode}`]: string };
export interface DarkReaderConfig {
    theme?: Partial<DarkReader.Theme>;
    fixes?: Partial<DarkReader.DynamicThemeFix>;
}

export type LayoutTheme = { [key in `${LayoutComponent}`]: `${ThemeMode}` };
export type LayoutFixed = { [key in `${LayoutComponent}`]: boolean };
