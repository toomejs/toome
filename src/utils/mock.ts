// 生成一个随机浮点数
export const random = () => +(Math.random() * 60).toFixed(2);
export const randomIntFrom = (min: number, max: number) => {
    const minc = Math.ceil(min);
    const maxc = Math.floor(max);
    return Math.floor(Math.random() * (maxc - minc + 1)) + minc; // 含最大值，含最小值
};
export const randomArray = (...some: number[]) => some[randomIntFrom(0, some.length - 1)];
