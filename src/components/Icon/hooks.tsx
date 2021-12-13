import { createFromIconfontCN } from '@ant-design/icons';

import { omit } from 'lodash-es';

import { useEffectOnce } from 'react-use';

import shallow from 'zustand/shallow';

import { createHookSelectors, createImmer } from '@/utils/store';

import { deepMerge } from '@/utils/tools';

import { getDefaultIconConfig } from './_default.config';
import type { IconConfig, IconProps, IconState } from './types';

const useIconStore = createImmer<IconState>(() => getDefaultIconConfig());
export const useIconConfig = createHookSelectors(useIconStore);
export const useSetupIcon = <T extends RecordAnyOrNever = RecordNever>(config?: IconConfig<T>) => {
    useEffectOnce(() => {
        if (config) {
            useIconStore.setState((state) => {
                const newState = deepMerge(state, omit(config, ['iconfont']) as any);
                if (config.iconfont?.prefix) {
                    newState.iconfont.prefix = config.iconfont.prefix;
                }
                if (config.iconfont?.url) {
                    newState.iconfont.instance = createFromIconfontCN({
                        scriptUrl: config.iconfont.url,
                    });
                }
                return newState;
            });
        }
    });
};
export const useIcon = <T extends Record<string, any>>(args: IconProps<T>) => {
    const config = useIconStore((state) => ({ ...state }), shallow);
    return deepMerge(config, {
        ...args,
        style: { fontSize: args.size, ...(args.style ?? {}) },
    }) as IconState<T>;
};
