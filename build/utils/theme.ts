import { generate } from '@ant-design/colors';
import { getThemeVariables } from 'antd/dist/theme';

import { pathResolve } from './paths';

export const primaryColor = '#0960bd';

export const darkMode = 'light';

type Fn = (...arg: any) => any;

type GenerateTheme = 'default' | 'dark';

interface GenerateColorsParams {
    mixLighten: Fn;
    mixDarken: Fn;
    tinycolor: any;
    color?: string;
}

function generateAntColors(color: string, theme: GenerateTheme = 'default') {
    return generate(color, {
        theme,
    });
}

export function getThemeColors(color?: string) {
    const tc = color || primaryColor;
    const lightColors = generateAntColors(tc);
    const primary = lightColors[5];
    const modeColors = generateAntColors(primary, 'dark');

    return [...lightColors, ...modeColors];
}

export function generateColors({
    color = primaryColor,
    mixLighten,
    mixDarken,
    tinycolor,
}: GenerateColorsParams) {
    const arr = new Array(19).fill(0);
    const lightens = arr.map((_t, i) => {
        return mixLighten(color, i / 5);
    });

    const darkens = arr.map((_t, i) => {
        return mixDarken(color, i / 5);
    });

    const alphaColors = arr.map((_t, i) => {
        return tinycolor(color)
            .setAlpha(i / 20)
            .toRgbString();
    });

    const shortAlphaColors = alphaColors.map((item) =>
        item.replace(/\s/g, '').replace(/0\./g, '.'),
    );

    const tinycolorLightens = arr
        .map((_t, i) => {
            return tinycolor(color)
                .lighten(i * 5)
                .toHexString();
        })
        .filter((item) => item !== '#ffffff');

    const tinycolorDarkens = arr
        .map((_t, i) => {
            return tinycolor(color)
                .darken(i * 5)
                .toHexString();
        })
        .filter((item) => item !== '#000000');
    return [
        ...lightens,
        ...darkens,
        ...alphaColors,
        ...shortAlphaColors,
        ...tinycolorDarkens,
        ...tinycolorLightens,
    ].filter((item) => !item.includes('-'));
}

/**
 * less global variable
 */
export function generateModifyVars(dark = false) {
    const palettes = generateAntColors(primaryColor);
    const primary = palettes[5];

    const primaryColorObj: Record<string, string> = {};

    for (let index = 0; index < 10; index++) {
        primaryColorObj[`primary-${index + 1}`] = palettes[index];
    }

    const modifyVars = getThemeVariables({ dark });
    return {
        ...modifyVars,
        // Used for global import to avoid the need to import each style file separately
        // reference:  Avoid repeated references
        hack: `${modifyVars.hack} @import (reference) "${pathResolve(
            'src/styles/antd/theme/index.less',
        )}";`,
        'primary-color': primary,
        ...primaryColorObj,
        'info-color': primary,
        'processing-color': primary,
        'success-color': '#55D187', //  Success color
        'error-color': '#ED6F6F', //  False color
        'warning-color': '#EFBD47', //   Warning color
        // 'border-color-base': '#EEEEEE',
        'font-size-base': '14px', //  Main font size
        'border-radius-base': '2px', //  Component/float fillet
        'link-color': primary, //   Link color
        'app-content-background': '#fafafa', //   Link color
    };
}
