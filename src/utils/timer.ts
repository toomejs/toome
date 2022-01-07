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
    date?: dayjs.ConfigType;
    format?: dayjs.OptionType;
    locale?: string;
    strict?: boolean;
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

export function timer(options?: TimeOptions): dayjs.Dayjs {
    if (!options) return dayjs();
    const { date, format, locale, strict, zonetime } = options;
    const { config } = ConfigStore.getState();
    // 每次创建一个新的时间对象
    // 如果没有传入local或timezone则使用应用配置
    return dayjs(date, format, locale, strict).tz(zonetime ?? config.timezone ?? 'UTC');
}
