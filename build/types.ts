import { ConfigEnv, UserConfig } from 'vite';

export type Configure = (params: ConfigEnv, isBuild: boolean) => UserConfig;
