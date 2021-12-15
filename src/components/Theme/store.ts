import create from 'zustand';

import { createSubsciberImmer } from '@/utils/store';

import type { ThemeState } from './types';

const ThemeSetup = create(() => ({
    created: false,
    setuped: false,
}));
const ThemeStore = createSubsciberImmer<ThemeState>(() => ({ mode: 'light' }));
export { ThemeSetup, ThemeStore };
