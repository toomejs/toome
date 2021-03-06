/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2022-01-18 06:00:37 +0800
 * @Path           : /src/components/Router/utils/helpers.ts
 * @Description    : 工具函数
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { trim } from 'lodash-es';
import { isNil } from 'ramda';

import { isUrl } from '@/utils';

import { IndexRouteOption, PathRouteOption, RouteOption } from '../types';

/**
 * 组装并格式化路由路径以获取完整路径
 * @param item 路由配置
 * @param basePath 基础路径
 * @param parentPath 父路径
 */
export const mergeRoutePath = (
    item: RouteOption,
    basePath: string,
    parentPath?: string,
): string => {
    const currentPath = 'path' in item && typeof item.path === 'string' ? item.path : '';
    // 如果没有传入父路径则使用basePath作为路由前缀
    let prefix = !parentPath ? basePath : `/${trim(parentPath, '/')}`;
    // 如果是父路径下的根路径则直接父路径
    if (trim(currentPath, '/') === '') return prefix;
    // 如果是顶级根路径并且当前路径以通配符"*"开头则直接返回当前路径
    if (prefix === '/' && currentPath.startsWith('*')) return currentPath;
    // 如果前缀不是"/",则为在前缀后添加"/"作为与当前路径的连接符
    if (prefix !== '/') prefix = `${prefix}/`;
    // 生成最终路径
    return `${prefix}${trim(currentPath, '/')}`;
};

export const checkRoute = (option: RouteOption): option is PathRouteOption | IndexRouteOption => {
    if ('index' in option) return option.index;
    if ('path' in option) {
        return !isNil(option.path) && option.path.length > 0 && !isUrl(option.path);
    }
    return false;
};
