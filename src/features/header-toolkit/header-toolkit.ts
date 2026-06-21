import { CONTAINER_ATTR, FALLBACK_ATTR, HEADER_ATTR, MOVED_ITEM_ATTR } from "../../shared/constants";
import { clearFixedPosition } from "../../shared/dom";
import type { ToolkitState } from "../../shared/state";
import { ACTION_ITEMS, HEADER_ITEMS, type HeaderItemConfig } from "./config";
export { findOriginalHeader } from "./header-detection";
import { findOriginalHeader } from "./header-detection";
import { appendProxy } from "./proxy-controls";
import { findSearchControl } from "./search-proxy";

export interface HeaderShell {
  header: HTMLElement;
  nav: HTMLElement;
  search: HTMLElement;
  actions: HTMLElement;
}

export function createHeaderShell(): HeaderShell {
  const header = document.createElement("header");
  header.className = "AppHeader zhihu-web-toolkit-header";
  header.setAttribute(HEADER_ATTR, "true");

  const inner = document.createElement("div");
  inner.className = "zhihu-web-toolkit-inner";

  const nav = document.createElement("nav");
  nav.className = "zhihu-web-toolkit-nav";
  nav.setAttribute("aria-label", "知乎主导航");

  const search = document.createElement("div");
  search.className = "zhihu-web-toolkit-search";

  const actions = document.createElement("div");
  actions.className = "zhihu-web-toolkit-actions";

  inner.append(nav, search, actions);
  header.appendChild(inner);

  return { header, nav, search, actions };
}

function findCurrentNativePopoverNode(key: string, initialNode: Element): Element {
  const originalHeader = findOriginalHeader();

  if (originalHeader) {
    const currentNode = [...ACTION_ITEMS, ...HEADER_ITEMS].find((item) => item.key === key)?.find(originalHeader);
    if (currentNode) {
      return currentNode;
    }
  }

  return initialNode;
}

function appendHeaderProxy(
  state: ToolkitState,
  node: Element | null,
  destination: Element,
  key: string,
  label: string,
  fallbackHref?: string,
): boolean {
  return appendProxy(state, node, destination, key, label, fallbackHref, {
    resolveNativeNode: findCurrentNativePopoverNode,
  });
}

export function createFallbackLink(item: HeaderItemConfig): HTMLAnchorElement | null {
  if (!item.fallbackHref) {
    return null;
  }

  const link = document.createElement("a");
  link.href = item.fallbackHref;
  link.textContent = item.label;
  link.title = item.label;
  link.setAttribute("aria-label", item.label);
  link.setAttribute(MOVED_ITEM_ATTR, item.key);
  link.setAttribute(FALLBACK_ATTR, "true");
  return link;
}

export function appendItem(
  state: ToolkitState,
  header: Element,
  destination: Element,
  item: HeaderItemConfig,
): void {
  const node = item.find(header);

  // Zhihu's header is React-owned. Reparenting native controls breaks React's DOM reconciliation.
  if (appendHeaderProxy(state, node, destination, item.key, item.label, item.fallbackHref)) {
    return;
  }

  const fallback = createFallbackLink(item);
  if (fallback) {
    destination.appendChild(fallback);
    state.missing.push(`${item.key}:fallback`);
    return;
  }

  state.missing.push(item.key);
}

export function moveExtraHeaderControls(
  state: ToolkitState,
  originalHeader: Element,
  destination: Element,
): void {
  const ruapjk = originalHeader.querySelector(".css-ruapjk") || document.querySelector(".css-ruapjk");

  if (!ruapjk) {
    state.missing.push("ruapjk");
    return;
  }

  if (ruapjk.querySelector(".AppHeader-profileEntry, .AppHeader-profile, .AppHeader-profileAvatar, img.Avatar")) {
    return;
  }

  appendHeaderProxy(state, ruapjk, destination, "ruapjk", "顶部按钮");
}

export function clearHeaderContainerPosition(element: HTMLElement): void {
  const parent = element.parentElement;
  if (!parent || parent === document.body || parent === document.documentElement) {
    return;
  }

  const style = getComputedStyle(parent);
  if (style.position === "fixed" || style.position === "sticky") {
    parent.setAttribute(CONTAINER_ATTR, "true");
    clearFixedPosition(parent);
  }
}

export function insertToolkitHeader(header: HTMLElement, originalHeader: Element): void {
  // Keep toolkit-owned DOM outside Zhihu's React root for the same reconciliation reason.
  void originalHeader;
  document.body.insertBefore(header, document.body.firstChild);
}

export function buildToolkitHeader(state: ToolkitState, originalHeader: Element): HeaderShell {
  const shell = createHeaderShell();
  const searchNode = findSearchControl(originalHeader);

  HEADER_ITEMS.forEach((item) => appendItem(state, originalHeader, shell.nav, item));

  if (searchNode) {
    appendHeaderProxy(state, searchNode, shell.search, "search", "搜索");
  } else {
    state.missing.push("search");
  }

  ACTION_ITEMS.forEach((item) => appendItem(state, originalHeader, shell.actions, item));
  moveExtraHeaderControls(state, originalHeader, shell.actions);

  return shell;
}
