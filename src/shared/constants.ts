export const GLOBAL_KEY = "__zhihuWebToolkit";

export const STYLE_ID = "zhihu-web-toolkit-style";
export const HEADER_ATTR = "data-zhihu-web-toolkit-header";
export const MOVED_ITEM_ATTR = "data-zhihu-web-toolkit-item";
export const FALLBACK_ATTR = "data-zhihu-web-toolkit-fallback";
export const CONTAINER_ATTR = "data-zhihu-web-toolkit-container";
export const FLOATING_CONTROLS_ID = "zhihu-web-toolkit-floating-controls";
export const THEME_BUTTON_ID = "zhihu-web-toolkit-theme-button";
export const WORD_BLOCK_BUTTON_ID = "zhihu-web-toolkit-word-block-button";
export const BACK_TO_TOP_BUTTON_ID = "zhihu-web-toolkit-back-to-top-button";
export const FLOATING_BUTTON_ACTIVE_CLASS = "zhihu-web-toolkit-floating-button-active";

export const APP_ROOT_SELECTORS = ["#root", "#app"] as const;

export interface HiddenSelectorConfig {
  selector: string;
  reason: string;
  volatile?: boolean;
}

export const HIDE_SELECTOR_CONFIGS = [
  {
    selector: "div.Card.CreatorEntrance.GlobalSideBar-creator.CreatorEntrance-link.CreatorEntrance-Link--smallIcon",
    reason: "创作者入口侧边栏卡片",
  },
  {
    selector: "div.KfeCollection-CreateSaltCard",
    reason: "盐选/收藏创建引导卡片",
  },
  {
    selector: "div.css-ga65ow",
    reason: "知乎 hash class 侧栏/运营卡片",
    volatile: true,
  },
  {
    selector: "div.css-1qyytj7",
    reason: "知乎 hash class 侧栏/运营卡片",
    volatile: true,
  },
  {
    selector: "div.css-1g41cri",
    reason: "知乎 hash class 侧栏/运营卡片",
    volatile: true,
  },
  {
    selector: "div.Card.css-173vipd",
    reason: "会员/VIP 推广卡片",
    volatile: true,
  },
  {
    selector: "footer",
    reason: "页面页脚",
  },
  {
    selector: "div.WriteArea.Card.css-1x8qqvf",
    reason: "回答编辑入口",
    volatile: true,
  },
] as const;

export const AD_SELECTOR_CONFIGS = [
  {
    selector: "div.Card.TopstoryItem.TopstoryItem--advertCard",
    reason: "首页信息流广告卡片",
  },
  {
    selector: "div.Pc-feedAd-new",
    reason: "新版 PC 信息流广告内容",
  },
] as const;

export const TOP_BANNER_SELECTOR_CONFIGS = [
  {
    selector: `header.AppHeader:not([${HEADER_ATTR}='true'])`,
    reason: "原生顶部 Header",
  },
  {
    selector: `.AppHeader:not([${HEADER_ATTR}='true'])`,
    reason: "非 header 标签承载的原生顶部 Header",
  },
] as const;

export const HIDE_SELECTORS = HIDE_SELECTOR_CONFIGS.map((config) => config.selector);
export const AD_SELECTORS = AD_SELECTOR_CONFIGS.map((config) => config.selector);
export const TOP_BANNER_SELECTORS = TOP_BANNER_SELECTOR_CONFIGS.map((config) => config.selector);

export const NATIVE_BACK_TO_TOP_SELECTORS = [
  `button[aria-label*='回到顶部']:not(#${BACK_TO_TOP_BUTTON_ID})`,
  `button[title*='回到顶部']:not(#${BACK_TO_TOP_BUTTON_ID})`,
  `[role='button'][aria-label*='回到顶部']:not(#${BACK_TO_TOP_BUTTON_ID})`,
  `[role='button'][title*='回到顶部']:not(#${BACK_TO_TOP_BUTTON_ID})`,
  `button[aria-label*='返回顶部']:not(#${BACK_TO_TOP_BUTTON_ID})`,
  `button[title*='返回顶部']:not(#${BACK_TO_TOP_BUTTON_ID})`,
  `[role='button'][aria-label*='返回顶部']:not(#${BACK_TO_TOP_BUTTON_ID})`,
  `[role='button'][title*='返回顶部']:not(#${BACK_TO_TOP_BUTTON_ID})`,
] as const;
