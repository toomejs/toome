import create from 'zustand';

import { subscribeWithSelector } from 'zustand/middleware';

import type { ThemeState } from './types';

export const ThemeSetup = create(() => ({
    created: false,
}));
export const ThemeStore = create<ThemeState>(subscribeWithSelector(() => ({ mode: 'light' })));
