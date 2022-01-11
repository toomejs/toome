/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-14 00:07:50 +0800
 * @Updated_at     : 2022-01-09 21:43:52 +0800
 * @Path           : /src/components/Menu/_default.config.ts
 * @Description    : 默认菜单配置
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { MenuStoreType } from './types';

export const getDefaultMenuStore = (): MenuStoreType => ({
    config: {
        type: 'router',
        server: null,
        menus: [],
    },
    data: [],
});
