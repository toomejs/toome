import { defineConfig } from 'windicss/helpers';

export default defineConfig({
    darkMode: 'class',
    extract: {
        include: ['index.html', 'src/**/*.{jsx,tsx,js,ts}'],
    },
    safelist: [],
    alias: {},
});
