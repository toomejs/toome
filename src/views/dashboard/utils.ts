import dayjs from 'dayjs';
import type { TopLevelFormatterParams } from 'echarts/types/dist/shared';

export const random = () => +(Math.random() * 60).toFixed(2);
export const randomIntFrom = (min: number, max: number) => {
    const minc = Math.ceil(min);
    const maxc = Math.floor(max);
    return Math.floor(Math.random() * (maxc - minc + 1)) + minc; // 含最大值，含最小值
};
export const randomArray = (...some: number[]) => some[randomIntFrom(0, some.length - 1)];

export const getTooltipFomatter = <T extends TopLevelFormatterParams>(
    params: T extends Array<infer C> ? C : T,
) => `<div style="margin: 0px 0 0;line-height:1;">
    <div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${dayjs(
        params.value[0],
    ).format('M-D HH:mm:ss')}</div>
    <div style="margin: 10px 0 0;line-height:1;">
        <div style="margin: 0px 0 0;line-height:1;">
            <div style="margin: 0px 0 0;line-height:1;">
                ${params.marker}
                <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${
                    params.seriesName
                }</span>
                <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${
                    params.value[1]
                }mbps</span>
                <div style="clear:both"></div>
            </div>
            <div style="clear:both"></div>
        </div>
        <div style="clear:both"></div>
    </div>
    <div style="clear:both"></div>
</div>`;
