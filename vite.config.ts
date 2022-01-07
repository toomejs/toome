import { UserConfig, ConfigEnv, defineConfig } from 'vite';

import { getConfig } from './build';

// https://vitejs.dev/config/

export default defineConfig((params: ConfigEnv): UserConfig => getConfig(params));
