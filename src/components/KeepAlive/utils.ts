import { isArray } from 'lodash-es';
import { clone, equals, find, findIndex, isEmpty, last, map, mergeRight, pick, pipe } from 'ramda';

import { KeepAliveActionType } from './constants';

import {
    KeepAliveAction,
    KeepAliveAddActionParams,
    KeepAliveDelActionParams,
    TagsViewDto,
} from './types';

const mergeMatchRoute = pipe(pick(['key', 'title', 'ele', 'name']), mergeRight({ active: true }));
const addKeepAlive = (state: Array<TagsViewDto>, matchRouteObj: KeepAliveAddActionParams) => {
    if (state.some((item) => equals(item.key, matchRouteObj.key) && item.active)) {
        return state;
    }
    let isNew = true;
    // 改变选中的值
    const data = map((item) => {
        if (equals(item.key, matchRouteObj.key)) {
            item.active = true;
            isNew = false;
        } else {
            item.active = false;
        }
        return item;
    }, state);
    if (isNew) {
        if (data.length >= 10) {
            data.shift();
        }
        data.push(mergeMatchRoute(matchRouteObj));
    }
    return data;
};

const delKeepAlive = (
    keepAliveList: Array<TagsViewDto>,
    { key, navigate }: KeepAliveDelActionParams,
) => {
    let index = findIndex((item) => equals(item.key, key), keepAliveList);
    if (equals(index, -1)) {
        return keepAliveList;
    }
    let pathname = '';
    if (keepAliveList.length > 1) {
        index = findIndex((item) => equals(item.key, key), keepAliveList);
        const data = keepAliveList[index];
        // 如果删除是  当前渲染     需要移动位置
        if (data && data.active) {
            // 如果是最后一个 那么  跳转到上一个
            if (equals(index, keepAliveList.length - 1)) {
                pathname = keepAliveList[index - 1].key;
            } else {
                // 跳转到最后一个
                pathname = last(keepAliveList)?.key ?? '';
            }
        }
    }
    keepAliveList.splice(index, 1);
    if (!isEmpty(pathname)) {
        navigate({ pathname });
    }
    return clone(keepAliveList);
};

const updateKeepAliveList = (state: Array<TagsViewDto>, keepAlive: Array<TagsViewDto>) => {
    return map((item) => {
        const data = find((res) => equals(res.key, item.key), keepAlive);
        if (data) {
            return mergeRight(item, data ?? {});
        }
        return item;
    }, state);
};
const updateKeepAlive = (state: Array<TagsViewDto>, keepAlive: Partial<TagsViewDto>) => {
    return map(
        (item) => (equals(item.key, keepAlive.key) ? mergeRight(item, keepAlive) : item),
        state,
    );
};
export const reducer = (state: Array<TagsViewDto>, action: KeepAliveAction): TagsViewDto[] => {
    switch (action.type) {
        case KeepAliveActionType.add:
            return addKeepAlive(state, action.payload);
        case KeepAliveActionType.del:
            return delKeepAlive(state, action.payload);
        case KeepAliveActionType.clear:
            return [];
        case KeepAliveActionType.update:
            return isArray(action.payload)
                ? updateKeepAliveList(state, action.payload)
                : updateKeepAlive(state, action.payload);
        default:
            return state;
    }
};
