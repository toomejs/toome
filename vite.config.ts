import { UserConfig, ConfigEnv } from 'vite';

import { getConfig } from './build';

// https://vitejs.dev/config/
export default (params: ConfigEnv): UserConfig => getConfig(params);
