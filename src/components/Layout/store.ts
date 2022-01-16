import { createContext, Dispatch } from 'react';

import { createStore } from '@/utils';

import { RouteComponentProps } from '../Router';

import { defaultConfig } from './default.config';

import { LayoutAction, LayoutContextType, LayoutStorageStoreType } from './types';

/**
 * 布局组件初始化状态池
 */
export const LayoutSetup = createStore<{ setuped?: true }>(() => ({}));
/**
 * 布局组件状态池
 */
export const LayoutStore = createStore<LayoutStorageStoreType>(() => defaultConfig);
export const LayoutContext = createContext<LayoutContextType | null>(null);
export const LayoutDispatchContext = createContext<Dispatch<LayoutAction> | null>(null);
export const LayoutRouteInfo = createContext<RouteComponentProps | null>(null);
