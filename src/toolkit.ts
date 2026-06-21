import {
  AD_SELECTOR_CONFIGS,
  GLOBAL_KEY,
  HEADER_ATTR,
  FLOATING_CONTROLS_ID,
  HIDE_SELECTOR_CONFIGS,
  MOVED_ITEM_ATTR,
  TOP_BANNER_SELECTOR_CONFIGS,
  WORD_BLOCK_BUTTON_ID,
  type HiddenSelectorConfig,
} from "./shared/constants";
import { clearFixedPosition, getHref, isZhihuHost, readText, visibleCount } from "./shared/dom";
import { createToolkitState, type ToolkitState } from "./shared/state";
import type { DestroyOptions, ToolkitApi, ToolkitReport } from "./shared/types";
import { currentThemeMode, mountFloatingControls, removeFloatingControls } from "./features/floating-controls/floating-controls";
import {
  buildToolkitHeader,
  clearHeaderContainerPosition,
  findOriginalHeader,
  insertToolkitHeader,
} from "./features/header-toolkit/header-toolkit";
import { injectStyle, removeStyle } from "./features/hide-elements/styles";

declare global {
  interface Window {
    __zhihuWebToolkit?: ToolkitApi;
  }
}

export function createToolkit(): ToolkitApi {
  const state = createToolkitState();

  const api: ToolkitApi = {
    apply: () => apply(state),
    destroy: (options?: DestroyOptions) => destroy(state, options),
    report: () => report(state),
  };

  return api;
}

export function installToolkit(): ToolkitApi {
  const previous = window[GLOBAL_KEY];
  if (previous && typeof previous.destroy === "function") {
    previous.destroy({ silent: true });
  }

  const api = createToolkit();
  window[GLOBAL_KEY] = api;
  api.apply();
  return api;
}

function clearHeaderObserver(state: ToolkitState): void {
  state.headerObserver?.disconnect();
  state.headerObserver = null;
}

function waitForHeader(state: ToolkitState): void {
  if (state.headerObserver || state.applied) {
    return;
  }

  const observeTarget = document.documentElement || document.body;
  if (!observeTarget) {
    return;
  }

  state.headerObserver = new MutationObserver(() => {
    if (!findOriginalHeader()) {
      return;
    }

    clearHeaderObserver(state);
    apply(state);
  });
  state.headerObserver.observe(observeTarget, { childList: true, subtree: true });
}

export function apply(state: ToolkitState): ToolkitReport {
  if (state.applied) {
    destroy(state, { silent: true });
  }

  state.missing = [];

  if (!isZhihuHost()) {
    console.info("[zhihu-web-toolkit] Not a zhihu.com page. No changes applied.");
    return report(state);
  }

  const originalHeader = findOriginalHeader();
  if (!originalHeader) {
    waitForHeader(state);
    console.warn("[zhihu-web-toolkit] No Zhihu header found. No changes applied.");
    return report(state);
  }
  clearHeaderObserver(state);

  const shell = buildToolkitHeader(state, originalHeader);

  state.originalHeader = originalHeader;
  state.rebuiltHeader = shell.header;

  injectStyle();

  clearFixedPosition(shell.header);

  insertToolkitHeader(shell.header, originalHeader);

  clearHeaderContainerPosition(shell.header);

  state.floatingControls = mountFloatingControls();

  state.applied = true;

  const currentReport = report(state);
  console.info("[zhihu-web-toolkit] Applied.", currentReport);
  return currentReport;
}

export function destroy(state: ToolkitState, options?: DestroyOptions): void {
  clearHeaderObserver(state);

  for (let index = state.geometryRestorers.length - 1; index >= 0; index -= 1) {
    state.geometryRestorers[index]();
  }

  for (let index = state.cleanupCallbacks.length - 1; index >= 0; index -= 1) {
    state.cleanupCallbacks[index]();
  }

  state.rebuiltHeader?.remove();
  removeFloatingControls();
  removeStyle();

  state.applied = false;
  state.originalHeader = null;
  state.rebuiltHeader = null;
  state.floatingControls = null;
  state.geometryRestorers = [];
  state.cleanupCallbacks = [];
  state.missing = [];

  if (!options?.silent) {
    console.info("[zhihu-web-toolkit] Destroyed.");
  }
}

export function report(state: ToolkitState): ToolkitReport {
  const rebuiltHeader = document.querySelector(`header[${HEADER_ATTR}='true']`);
  const floatingControls = document.getElementById(FLOATING_CONTROLS_ID);
  const ruapjkProxied = Boolean(rebuiltHeader?.querySelector(".css-ruapjk"));

  return {
    active: state.applied,
    isZhihu: isZhihuHost(),
    url: location.href,
    themeMode: currentThemeMode(),
    headerFound: Boolean(state.originalHeader || findOriginalHeader()),
    rebuiltHeaderFound: Boolean(rebuiltHeader),
    floatingControlsFound: Boolean(floatingControls),
    wordBlockButtonFound: Boolean(floatingControls?.querySelector(`#${WORD_BLOCK_BUTTON_ID}`)),
    hiddenTargets: buildHiddenReports(HIDE_SELECTOR_CONFIGS),
    hiddenAds: buildHiddenReports(AD_SELECTOR_CONFIGS),
    hiddenTopBanners: buildHiddenReports(TOP_BANNER_SELECTOR_CONFIGS),
    keptItems: Array.from(document.querySelectorAll(`header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}]`)).map((element) => ({
      key: element.getAttribute(MOVED_ITEM_ATTR),
      text: readText(element),
      href: getHref(element),
    })),
    missing: state.missing.slice(),
    ruapjkProxied,
    ruapjkMoved: ruapjkProxied,
  };
}

function buildHiddenReports(configs: readonly HiddenSelectorConfig[]): ToolkitReport["hiddenTargets"] {
  return configs.map((config) => ({
    selector: config.selector,
    count: document.querySelectorAll(config.selector).length,
    reason: config.reason,
    volatile: Boolean(config.volatile),
    visibleCount: visibleCount(config.selector),
  }));
}
