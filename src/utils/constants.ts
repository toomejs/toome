/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2022-01-11 20:28:30 +0800
 * @Updated_at     : 2022-01-11 20:31:21 +0800
 * @Path           : /src/utils/constants.ts
 * @Description    : 常量和enum
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */

/**
 * 屏幕尺寸类型
 */
export enum ScreenSizeType {
    XS = 'xs',
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl',
    DoubleXL = '2xl',
}
export const screenSize: { [key in `${ScreenSizeType}`]: number } = {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    '2xl': 1400,
};
