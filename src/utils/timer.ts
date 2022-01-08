/*
 * @Author         : pincman
 * @HomePage       : https://pincman.com
 * @Support        : support@pincman.com
 * @Created_at     : 2021-12-29 09:13:53 +0800
 * @Updated_at     : 2022-01-08 14:11:18 +0800
 * @Path           : /src/utils/timer.ts
 * @Description    : 时间函数
 * @LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import localeData from 'dayjs/plugin/localeData';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import objectSupport from 'dayjs/plugin/objectSupport';

import { ConfigStore } from '@/components/Config/store';
/**
 * 时间生成器参数接口
 */
export interface TimeOptions {
    /** 时间对象,可以是字符串,dayjs对象,date对象等一切dayjs支持的格式 */
    date?: dayjs.ConfigType;
    /** 格式化选项 */
    format?: dayjs.OptionType;
    /** 本地化语言 */
    locale?: string;
    /** 是否为严格模式 */
    strict?: boolean;
    /** 时区 */
    zonetime?: string;
}

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(dayOfYear);
dayjs.extend(objectSupport);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

/**
 * 根据参数和应用配置生成一个dayjs对象
 * @param options 配置
 */
export function timer(options?: TimeOptions): dayjs.Dayjs {
    if (!options) return dayjs();
    options.date;
    const { date, format, locale, strict, zonetime } = options;
    const { config } = ConfigStore.getState();
    // 如果没有传入local或timezone则使用应用配置
    return dayjs(date, format, locale, strict).tz(zonetime ?? config.timezone ?? 'UTC');
}
