import { RefObject } from 'react';

import { RouteNavigator, RouteOption } from '../Router';

import { AliveActionType } from './constants';

export type KeepAliveRouteOption = RouteOption<{ id: string }>;

export interface KeepAliveConfig {
    path?: string;
    active?: string | null;
    // isAsyncInclude: boolean; // 是否异步添加 Include  如果不是又填写了 true 会导致重复渲染
    exclude?: Array<string>;
    maxLen?: number;
    notFound?: string;
}

export interface KeepAliveStoreType extends Required<KeepAliveConfig> {
    include?: Array<string>;
    lives: string[];
}
export interface AlivePageProps {
    isActive: boolean;
    id: string;
    renderDiv: RefObject<HTMLDivElement>;
}
export interface KeepAliveContextType {
    id: string;
    dispatch?: React.Dispatch<KeepAliveAction>;
}

// export interface AliveItemType {
//     id: string;
//     isActive: boolean;
// }

export type KeepAliveAction =
    | {
          type: AliveActionType.REMOVE;
          params: {
              id: string;
              navigate: RouteNavigator;
          };
      }
    | {
          type: AliveActionType.ADD;
          id: string;
      }
    | {
          type: AliveActionType.ACTIVE;
          id: string;
      }
    | {
          type: AliveActionType.CLEAR;
          navigate: RouteNavigator;
      };
