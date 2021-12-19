import { createFromIconfontCN } from '@ant-design/icons';
import { omit } from 'lodash-es';
import create from 'zustand';

import { useStoreSetuped, createImmer, deepMerge } from '@/utils';

import { getDefaultIconConfig } from './_default.config';
import type { IconComputed, IconConfig, IconProps, IconState } from './types';
import type { IconType } from './constants';

export const Setuped = create<{ setuped?: true }>(() => ({}));

const IconStore = createImmer<IconState>(() => getDefaultIconConfig());
export const useSetupIcon = <T extends RecordAnyOrNever = RecordNever>(config?: IconConfig<T>) => {
    useStoreSetuped({
        store: Setuped,
        callback: () => {
            const options: IconConfig = config ?? {};
            IconStore.setState((state) => {
                const newState = deepMerge(state, omit(config, ['iconfont']) as any);
                if (options.iconfont_urls) {
                    newState.iconfont = createFromIconfontCN({
                        scriptUrl: options.iconfont_urls,
                    });
                }
                return newState;
            });
        },
    });
};
export const useIcon = (args: IconProps) => {
    const config = IconStore((state) => ({ ...state }));
    const params = omit(config, ['size', 'prefix', 'iconfont_urls']);
    const csize = typeof config.size === 'number' ? `${config.size}px` : config.size;
    const style = { fontSize: args.style?.fontSize ?? csize, ...(args.style ?? {}) };
    const classes = [...config.classes, ...(args.classNames ?? [])];
    if ('component' in args) {
        return deepMerge<RecordAny, RecordAny>(params, {
            ...args,
            type: 'component',
            style,
            classes,
        }) as IconComputed;
    }
    let name: string;
    let type: `${IconType}` = 'svg';
    const [prefix, ...names] = args.name.split(':');
    if (prefix === 'if') {
        name = `${config.prefix.iconfont}-${names.join(':')}`;
        type = 'iconfont';
    } else if (prefix === 'fy') {
        name = names.join(':');
        type = 'iconify';
    } else {
        name = `${config.prefix.svg}-${names.join(':')}`;
        type = 'svg';
    }
    return deepMerge(config, {
        ...args,
        name,
        type,
        inline: prefix === 'fy' ? (args as any).inline : undefined,
        iconfont: prefix === 'if' ? config.iconfont : undefined,
        style,
        classes,
    }) as IconComputed;
};
