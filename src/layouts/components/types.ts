import type { LayoutComponent, LayoutConfig, LayoutMode, LayoutTheme } from '@/components/Config';
import type { MenuOption } from '@/components/Menu';

export enum LayoutActionType {
    CHANGE_FIXED = 'change_fixed',
    CHANGE_VARS = 'change_vars',
    CHANGE_MODE = 'change_mode',
    CHANGE_MENU = 'change_menu',
    CHANGE_COLLAPSE = 'change_collapse',
    CHANGE_THEME = 'change_theme',
    TOGGLE_COLLAPSE = 'toggle_collapse',
}
export interface LayoutVarsConfig {
    sidebarWidth?: string | number;
    sidebarCollapseWidth?: string | number;
    headerHeight?: string | number;
    headerLightColor?: string;
}
export interface LayoutState extends ReRequired<LayoutConfig> {
    menu: LayoutMenuState;
    vars: Required<LayoutVarsConfig>;
}
export interface LayoutMenuState {
    data: MenuOption[];
    opens: string[];
    selects: string[];
    rootSubKeys: string[];
    embed: LayoutEmbedMenuState;
}
export interface LayoutEmbedMenuState {
    data: MenuOption[];
    selects: string[];
}

export type LayoutAction =
    | { type: LayoutActionType.CHANGE_FIXED; key: `${LayoutComponent}`; value: boolean }
    | { type: LayoutActionType.CHANGE_VARS; vars: Required<LayoutVarsConfig>; isMobile: boolean }
    | {
          type: LayoutActionType.CHANGE_MODE;
          value: `${LayoutMode}`;
      }
    | {
          type: LayoutActionType.CHANGE_MENU;
          value: RePartial<LayoutMenuState>;
      }
    | { type: LayoutActionType.CHANGE_COLLAPSE; value: boolean }
    | { type: LayoutActionType.TOGGLE_COLLAPSE }
    | {
          type: LayoutActionType.CHANGE_THEME;
          value: Partial<LayoutTheme>;
      };
