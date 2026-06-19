export const GLOBAL_KEY = "__zhihuWebToolkit";

export const STYLE_ID = "zhihu-web-toolkit-style";
export const HEADER_ATTR = "data-zhihu-web-toolkit-header";
export const ORIGINAL_HIDDEN_CLASS = "zhihu-web-toolkit-original-header-hidden";
export const MOVED_ITEM_ATTR = "data-zhihu-web-toolkit-item";
export const FALLBACK_ATTR = "data-zhihu-web-toolkit-fallback";
export const CONTAINER_ATTR = "data-zhihu-web-toolkit-container";
export const FLOATING_CONTROLS_ID = "zhihu-web-toolkit-floating-controls";
export const THEME_BUTTON_ID = "zhihu-web-toolkit-theme-button";
export const WORD_BLOCK_BUTTON_ID = "zhihu-web-toolkit-word-block-button";
export const FLOATING_BUTTON_ACTIVE_CLASS = "zhihu-web-toolkit-floating-button-active";

export const HIDE_SELECTORS = [
  "div.Card.CreatorEntrance.GlobalSideBar-creator.CreatorEntrance-link.CreatorEntrance-Link--smallIcon",
  "div.KfeCollection-CreateSaltCard",
  "div.css-ga65ow",
  "div.css-1qyytj7",
  "div.css-1g41cri",
  "div.Card.css-173vipd",
  "footer",
  "div.WriteArea.Card.css-1x8qqvf",
] as const;

export const AD_SELECTORS = [
  "div.Card.TopstoryItem.TopstoryItem--advertCard",
  "div.Pc-feedAd-new",
] as const;

export const TOP_BANNER_SELECTORS = [
  `header.AppHeader:not([${HEADER_ATTR}='true'])`,
  `.AppHeader:not([${HEADER_ATTR}='true'])`,
] as const;
