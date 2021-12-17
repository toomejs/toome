import { createFromIconfontCN } from '@ant-design/icons';
import { omit } from 'lodash-es';

import create from 'zustand';

import { useStoreSetuped, createImmer, deepMerge } from '@/utils';

import { getDefaultIconConfig } from './_default.config';
import { IconType } from './constants';
import type { BaseIconProps, IconComputed, IconConfig, IconState } from './types';

const Setuped = create(() => ({}));

const IconStore = createImmer<IconState>(() => getDefaultIconConfig());
export const useSetupIcon = <T extends RecordAnyOrNever = RecordNever>(config?: IconConfig<T>) => {
    useStoreSetuped({
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
export const useIcon = <
    U extends BaseIconProps<{ type?: `${IconType}` } & T>,
    T extends RecordAnyOrNever = RecordNever,
>(
    args: U,
): IconComputed<T> => {
    const config = IconStore((state) => ({ ...state }));
    let name: string;
    let { iconfont } = config;
    if (args.type === IconType.ICONFONT) {
        name = `${config.prefix.iconfont}-${args.name}`;
    } else if (args.type === IconType.XICONS) {
        name = `@sicons/${args.name.replaceAll(':', '/')}.svg`;
    } else {
        name = `${config.prefix.svg}-${args.name}`;
    }
    if (args.type !== IconType.ICONFONT) iconfont = undefined;
    const style = { fontSize: args.style?.fontSize ?? config.size, ...(args.style ?? {}) };
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
