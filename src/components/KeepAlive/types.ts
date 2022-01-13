import { JSXElementConstructor, ReactElement, RefObject } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { RouteOption } from '../Router';

import { KeepAliveActionType } from './constants';

export type KeepAliveRouteOption = RouteOption<{ id: string }>;
export type KeepAliveChildren = ReactElement<any, string | JSXElementConstructor<any>> | null;
export interface KeepAliveProps {
    activeName?: string;
    isAsyncInclude: boolean; // 是否异步添加 Include  如果不是又填写了 true 会导致重复渲染
    include?: Array<string>;
    exclude?: Array<string>;
    maxLen?: number;
    children: KeepAliveChildren;
}
export interface KeepAliveComponentProps {
    active: boolean;
    children: KeepAliveChildren;
    name: string;
    renderDiv: RefObject<HTMLDivElement>;
}
export interface KeepAliveContextType {
    name?: string;
    dispatch?: React.Dispatch<KeepAliveAction>;
    mate?: any;
}

export interface KeepAliveDelActionParams {
    key: string;
    navigate: NavigateFunction;
}
export interface KeepAliveAddActionParams {
    key: string;
    title: string;
    name: string;
    selectedKeys: string[];
}
export interface TagsViewDto {
    key: string;
    active: boolean;
    title: string;
    name: string;
}

export type KeepAliveAction =
    | {
          type: KeepAliveActionType.del;
          payload: KeepAliveDelActionParams;
      }
    | {
          type: KeepAliveActionType.add;
          payload: KeepAliveAddActionParams;
      }
    | {
          type: KeepAliveActionType.update;
          payload: Partial<TagsViewDto> | TagsViewDto[];
      }
    | {
          type: KeepAliveActionType.clear;
      };
