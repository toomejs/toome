import { createFromIconfontCN } from '@ant-design/icons';
import { omit } from 'lodash-es';

import { useStoreSetuped, deepMerge } from '@/utils';

import type { IconComputed, IconConfig, IconProps } from './types';
import type { IconType } from './constants';
import { IconSetup, IconStore } from './store';

export const useSetupIcon = <T extends RecordAnyOrNever = RecordNever>(config?: IconConfig<T>) => {
    useStoreSetuped({
        store: IconSetup,
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
    const params = omit(config, ['size', 'prefix', 'classes', 'iconfont_urls']);
    const csize = typeof config.size === 'number' ? `${config.size}px` : config.size;
    const style = { fontSize: args.style?.fontSize ?? csize, ...(args.style ?? {}) };
    const className = [...config.classes, args.className];
    if ('component' in args) {
        const result = deepMerge<RecordAny, RecordAny>(params, {
            ...args,
            type: 'component',
            style,
            className,
        });
        return omit(result, ['iconfont']) as IconComputed;
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
    const result = deepMerge(config, {
        ...args,
        name,
        type,
        style,
        className,
    });
    return (prefix !== 'if' ? omit(result, ['iconfont']) : result) as IconComputed;
};
