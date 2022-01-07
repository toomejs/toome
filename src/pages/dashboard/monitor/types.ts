import type { CSSProperties } from 'react';

import type { PresetStatusColorType } from 'antd/lib/_util/colors';

import type { IconComponent, IconName } from '@/components/Icon';

import type { ServerStatus } from './constants';

export interface ServerItem {
    id: string;
    os: string;
    cpu: number;
    memory: number;
    disk: Array<{ path: string; value: number }>;
    status: `${ServerStatus}`;
    insetIp: string;
    publicIp: string;
}
export type ServerStatusOption = {
    [key in `${ServerStatus}`]: {
        text: string;
        badge: PresetStatusColorType;
    };
};
export type AppItem = { name: string; style?: CSSProperties; className?: string } & (
    | {
          icon: IconName;
      }
    | {
          component: IconComponent;
      }
);
