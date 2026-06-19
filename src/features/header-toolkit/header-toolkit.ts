import { CONTAINER_ATTR, FALLBACK_ATTR, HEADER_ATTR, MOVED_ITEM_ATTR } from "../../shared/constants";
import { clearFixedPosition, readText } from "../../shared/dom";
import type { ToolkitState } from "../../shared/state";
import { ACTION_ITEMS, HEADER_ITEMS, type HeaderItemConfig } from "./config";

export interface HeaderShell {
  header: HTMLElement;
  nav: HTMLElement;
  search: HTMLElement;
  actions: HTMLElement;
}

export function findOriginalHeader(): Element | null {
  return document.querySelector("header.AppHeader") || document.querySelector(".AppHeader") || document.querySelector("header");
}

export function findSearchControl(header: Element): Element | null {
  const input =
    header.querySelector("input[type='search']") ||
    header.querySelector("input[placeholder*='搜索']") ||
    header.querySelector("input[aria-label*='搜索']") ||
    header.querySelector(".SearchBar input");

  if (!input) {
    return null;
  }

  return input.closest("form") || input.closest(".SearchBar") || input.closest("[role='search']") || input;
}

export function createHeaderShell(): HeaderShell {
  const header = document.createElement("header");
  header.className = "zhihu-web-toolkit-header";
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

export function isInsideMovedNode(state: ToolkitState, node: Element): boolean {
  return state.movedItems.some((item) => item.node.contains(node));
}

export function moveInto(state: ToolkitState, node: Element | null, destination: Element, key: string, label: string): boolean {
  if (!node || isInsideMovedNode(state, node)) {
    return false;
  }

  const placeholder = document.createComment(`zhihu-web-toolkit:${key}`);
  node.parentNode?.insertBefore(placeholder, node);

  node.setAttribute(MOVED_ITEM_ATTR, key);
  if (label && !node.getAttribute("aria-label") && !readText(node)) {
    node.setAttribute("aria-label", label);
  }
  if (label && !node.getAttribute("title")) {
    node.setAttribute("title", label);
  }

  destination.appendChild(node);
  state.movedItems.push({ key, node, placeholder });
  return true;
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

export function appendItem(state: ToolkitState, header: Element, destination: Element, item: HeaderItemConfig): void {
  const node = item.find(header);
  if (node && moveInto(state, node, destination, item.key, item.label)) {
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

export function moveExtraHeaderControls(state: ToolkitState, originalHeader: Element, destination: Element): void {
  const ruapjk = originalHeader.querySelector(".css-ruapjk") || document.querySelector(".css-ruapjk");

  if (ruapjk) {
    moveInto(state, ruapjk, destination, "ruapjk", "顶部按钮");
  } else {
    state.missing.push("ruapjk");
  }
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

export function buildToolkitHeader(state: ToolkitState, originalHeader: Element): HeaderShell {
  const shell = createHeaderShell();
  const searchNode = findSearchControl(originalHeader);

  HEADER_ITEMS.forEach((item) => appendItem(state, originalHeader, shell.nav, item));

  if (searchNode) {
    moveInto(state, searchNode, shell.search, "search", "搜索");
  } else {
    state.missing.push("search");
  }

  ACTION_ITEMS.forEach((item) => appendItem(state, originalHeader, shell.actions, item));
  moveExtraHeaderControls(state, originalHeader, shell.actions);

  return shell;
}
