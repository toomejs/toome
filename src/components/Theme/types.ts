/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark';

/**
 * @description 主题配置
 * @export
 * @interface ThemeConfig
 */
export interface ThemeConfig {
    mode?: ThemeMode;
}

/**
 * @description 主题配置状态
 * @export
 * @interface ThemeState
 * @extends {Required<ThemeConfig>}
 */
export interface ThemeState extends Required<ThemeConfig> {}
