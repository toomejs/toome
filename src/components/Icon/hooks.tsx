import { createFromIconfontCN } from '@ant-design/icons';
import { omit } from 'lodash-es';

import create from 'zustand';

import { useSetupedEffect } from '@/hooks';
import { createImmer } from '@/utils/store';
import { deepMerge } from '@/utils/tools';

import { getDefaultIconConfig } from './_default.config';
import { IconType } from './constants';
import type { BaseIconProps, IconComputed, IconConfig, IconState } from './types';

const Setuped = create(() => ({
    created: false,
    setuped: false,
}));

const IconStore = createImmer<IconState>(() => getDefaultIconConfig());
export const useSetupIcon = <T extends RecordAnyOrNever = RecordNever>(config?: IconConfig<T>) => {
    useSetupedEffect({
        store: Setuped,
        callback: () => {
            if (config) {
                IconStore.setState((state) => {
                    const newState = deepMerge(state, omit(config, ['iconfont']) as any);
                    if (config.iconfont_urls) {
                        newState.iconfont = createFromIconfontCN({
                            scriptUrl: config.iconfont_urls,
                        });
                    }
                    return newState;
                });
            }
        },
    });
};
export const useIcon = <U extends BaseIconProps<T>, T extends RecordAny>(
    args: U,
): IconComputed<T> => {
    const config = IconStore((state) => ({ ...state }));
    let { name } = args;
    let { iconfont } = config;
    if (args.type === IconType.ICONFONT) {
        name = `${config.prefix.iconfont}-${args.name}`;
    } else if (args.type === IconType.SVG) {
        name = `${config.prefix.svg}-${args.name}`;
    }
    if (args.type !== IconType.ICONFONT) iconfont = undefined;
    const style = { fontSize: args.size ?? config.size, ...(args.style ?? {}) };
    return omit(
        deepMerge(config, {
            ...args,
            name,
            iconfont,
            style,
        }),
        ['size', 'prefix', 'iconfont_urls'],
    ) as any;
};
