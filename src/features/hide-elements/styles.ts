import {
  AD_SELECTORS,
  FALLBACK_ATTR,
  HEADER_ATTR,
  HIDE_SELECTORS,
  ORIGINAL_HIDDEN_CLASS,
  STYLE_ID,
  TOP_BANNER_SELECTORS,
} from "../../shared/constants";
import { buildFloatingControlsCss } from "../floating-controls/styles";

export function buildToolkitCss(): string {
  const hiddenSelectors = [...HIDE_SELECTORS, ...AD_SELECTORS, ...TOP_BANNER_SELECTORS];

  return `${hiddenSelectors.join(",\n")} {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

.${ORIGINAL_HIDDEN_CLASS} {
  display: none !important;
}

header[${HEADER_ATTR}='true'],
html body .AppHeader,
html body header.AppHeader,
html body .AppHeader.is-fixed,
html body .AppHeader.Sticky,
html body .Sticky.AppHeader {
  position: static !important;
  top: auto !important;
  transform: none !important;
}

header[${HEADER_ATTR}='true'] {
  width: 100% !important;
  z-index: auto !important;
  background: #fff !important;
  border-bottom: 1px solid #ebebeb !important;
  box-shadow: none !important;
}

.zhihu-web-toolkit-inner {
  box-sizing: border-box !important;
  min-height: 52px !important;
  max-width: 1120px !important;
  margin: 0 auto !important;
  padding: 0 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 14px !important;
}

.zhihu-web-toolkit-nav,
.zhihu-web-toolkit-actions {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  flex: 0 0 auto !important;
}

.zhihu-web-toolkit-search {
  display: flex !important;
  align-items: center !important;
  flex: 1 1 320px !important;
  min-width: 180px !important;
  max-width: 480px !important;
}

.zhihu-web-toolkit-search > *,
.zhihu-web-toolkit-search form,
.zhihu-web-toolkit-search .SearchBar {
  width: 100% !important;
  max-width: 100% !important;
}

header[${HEADER_ATTR}='true'] a,
header[${HEADER_ATTR}='true'] button,
header[${HEADER_ATTR}='true'] [role='button'] {
  flex-shrink: 0 !important;
}

header[${HEADER_ATTR}='true'] [${FALLBACK_ATTR}='true'] {
  color: #121212 !important;
  display: inline-flex !important;
  align-items: center !important;
  height: 32px !important;
  padding: 0 8px !important;
  text-decoration: none !important;
  font-size: 15px !important;
}

header[${HEADER_ATTR}='true'] .css-ruapjk {
  display: inline-flex !important;
  visibility: visible !important;
  pointer-events: auto !important;
  flex-shrink: 0 !important;
}

@media (max-width: 760px) {
  .zhihu-web-toolkit-inner {
    flex-wrap: wrap !important;
    padding: 8px 12px !important;
    gap: 8px !important;
  }

  .zhihu-web-toolkit-search {
    order: 3 !important;
    flex-basis: 100% !important;
    max-width: none !important;
  }
}

${buildFloatingControlsCss()}`;
}

export function injectStyle(): void {
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = buildToolkitCss();
  document.head.appendChild(style);
}

export function removeStyle(): void {
  document.getElementById(STYLE_ID)?.remove();
}
