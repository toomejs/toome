export type ThemeMode = 'light' | 'dark';
export interface ThemeConfig {
    mode?: ThemeMode;
}
export type ThemeState = Required<ThemeConfig>;
