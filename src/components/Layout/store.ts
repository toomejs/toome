import { createContext, Dispatch } from 'react';

import { createImmberSubsciber } from '@/utils';

import { RouteComponentProps } from '../Router';

import { defaultConfig } from './default.config';

import { LayoutAction, LayoutContextType, LayoutStorageStoreType } from './types';

/**
 * 布局组件初始化状态池
 */
export const LayoutSetup = createImmberSubsciber<{ setuped?: true }>(() => ({}));
/**
 * 布局组件状态池
 */
export const LayoutStore = createImmberSubsciber<LayoutStorageStoreType>(() => defaultConfig);
export const LayoutContext = createContext<LayoutContextType | null>(null);
export const LayoutDispatchContext = createContext<Dispatch<LayoutAction> | null>(null);
export const LayoutRouteInfo = createContext<RouteComponentProps | null>(null);
