import type { ThemeMode } from './types';
/**
 * @description : 设置elment和本地存储的主题设置
 * @param        {ThemeMode} theme
 * @param        {LocalForage} storage
 * @return       void
 */
export const changeHtmlThemeMode = async (theme: ThemeMode, storage: LocalForage | undefined) => {
    if (storage) {
        const reverse = theme === 'dark' ? 'light' : 'dark';
        const html = document.documentElement;
        html.removeAttribute('data-theme');
        html.classList.remove(reverse);
        html.classList.remove(theme);
        html.setAttribute('data-theme', theme);
        html.classList.add(theme);
        await storage.setItem<ThemeMode>('theme', theme);
    }
};
