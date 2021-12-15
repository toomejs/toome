import type { ThemeMode } from './types';

export const changeHtmlThemeMode = (theme: ThemeMode, storage: LocalForage | undefined) => {
    if (storage) {
        const reverse = theme === 'dark' ? 'light' : 'dark';
        const html = document.documentElement;
        html.removeAttribute('data-theme');
        html.classList.remove(reverse);
        html.classList.remove(theme);
        html.setAttribute('data-theme', theme);
        html.classList.add(theme);
        storage.setItem<ThemeMode>('theme', theme);
    }
};
