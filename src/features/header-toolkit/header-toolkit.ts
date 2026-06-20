import { CONTAINER_ATTR, FALLBACK_ATTR, HEADER_ATTR, MOVED_ITEM_ATTR } from "../../shared/constants";
import { clearFixedPosition, getHref, readText } from "../../shared/dom";
import type { ToolkitState } from "../../shared/state";
import { ACTION_ITEMS, HEADER_ITEMS, type HeaderItemConfig } from "./config";

export interface HeaderShell {
  header: HTMLElement;
  nav: HTMLElement;
  search: HTMLElement;
  actions: HTMLElement;
}

export function findOriginalHeader(): Element | null {
  return (
    document.querySelector(`header.AppHeader:not([${HEADER_ATTR}='true'])`) ||
    document.querySelector(`.AppHeader:not([${HEADER_ATTR}='true'])`) ||
    document.querySelector(`header:not([${HEADER_ATTR}='true'])`)
  );
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

function prepareHeaderItem(node: Element, key: string, label: string): void {
  node.setAttribute(MOVED_ITEM_ATTR, key);
  if (label && !node.getAttribute("aria-label") && !readText(node)) {
    node.setAttribute("aria-label", label);
  }
  if (label && !node.getAttribute("title")) {
    node.setAttribute("title", label);
  }
}

function stripDuplicateIds(root: Element): void {
  root.removeAttribute("id");
  root.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
}

function cloneHeaderItem(node: Element, key: string, label: string): Element {
  const proxy = node.cloneNode(true) as Element;
  stripDuplicateIds(proxy);
  prepareHeaderItem(proxy, key, label);

  if (proxy instanceof HTMLElement) {
    clearFixedPosition(proxy);
  }
  proxy.querySelectorAll("*").forEach((element) => {
    if (element instanceof HTMLElement) {
      clearFixedPosition(element);
    }
  });

  return proxy;
}

function findSearchInput(root: Element | null): HTMLInputElement | HTMLTextAreaElement | null {
  if (!root) {
    return null;
  }

  if (root instanceof HTMLInputElement || root instanceof HTMLTextAreaElement) {
    return root;
  }

  return root.querySelector("input,textarea");
}

function findSearchForm(root: Element | null): HTMLFormElement | null {
  if (!root) {
    return null;
  }

  if (root instanceof HTMLFormElement) {
    return root;
  }

  return root.querySelector("form") || findSearchInput(root)?.closest("form") || null;
}

function setNativeInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");

  if (descriptor?.set) {
    descriptor.set.call(input, value);
  } else {
    input.value = value;
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function submitNativeSearch(nativeSearch: Element, query: string): void {
  const nativeInput = findSearchInput(nativeSearch);
  if (nativeInput) {
    setNativeInputValue(nativeInput, query);
  }

  const nativeForm = findSearchForm(nativeSearch);
  if (nativeForm) {
    if (typeof nativeForm.requestSubmit === "function") {
      nativeForm.requestSubmit();
      return;
    }

    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    if (nativeForm.dispatchEvent(submitEvent) && typeof nativeForm.submit === "function") {
      nativeForm.submit();
    }
    return;
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    window.location.href = `/search?type=content&q=${encodeURIComponent(trimmedQuery)}`;
  }
}

function proxySearch(proxy: HTMLElement, nativeSearch: Element): void {
  const submit = (event?: Event) => {
    event?.preventDefault();
    const proxyInput = findSearchInput(proxy);
    submitNativeSearch(nativeSearch, proxyInput?.value || "");
  };

  const proxyForm = findSearchForm(proxy);
  if (proxyForm) {
    proxyForm.addEventListener("submit", submit);
  } else {
    proxy.addEventListener("submit", submit);
  }

  const proxyInput = findSearchInput(proxy);
  proxyInput?.addEventListener("keydown", (event) => {
    if (event instanceof KeyboardEvent && event.key === "Enter") {
      submit(event);
    }
  });

  proxy.querySelectorAll("button,input[type='submit'],input[type='button']").forEach((element) => {
    element.addEventListener("click", (event) => submit(event));
  });
}

const ACTIVATION_SELECTOR = "a,button,input,textarea,select,[role='button'],[tabindex]";
const MOVED_NATIVE_ITEM_KEYS = new Set(["messages", "inbox", "profile"]);

function findActivationTarget(node: Element): HTMLElement | null {
  if (node instanceof HTMLElement && node.matches(ACTIVATION_SELECTOR)) {
    return node;
  }

  const closest = node.closest(ACTIVATION_SELECTOR);
  return closest instanceof HTMLElement ? closest : null;
}

function getNodePath(root: Node, node: Node): number[] | null {
  const path: number[] = [];
  let current: Node | null = node;

  while (current && current !== root) {
    const parent: Node | null = current.parentNode;
    if (!parent) {
      return null;
    }

    path.unshift(Array.prototype.indexOf.call(parent.childNodes, current));
    current = parent;
  }

  return current === root ? path : null;
}

function resolveNodePath(root: Node, path: number[]): Node | null {
  let current: Node | null = root;

  for (const index of path) {
    current = current?.childNodes[index] || null;
    if (!current) {
      return null;
    }
  }

  return current;
}

function findEquivalentElement(proxyTarget: EventTarget | null, proxyRoot: Element, nativeRoot: Element): Element {
  if (!(proxyTarget instanceof Node) || !proxyRoot.contains(proxyTarget)) {
    return nativeRoot;
  }

  const path = getNodePath(proxyRoot, proxyTarget);
  if (!path) {
    return nativeRoot;
  }

  const equivalent = resolveNodePath(nativeRoot, path);
  if (equivalent instanceof Element) {
    return equivalent;
  }

  return equivalent?.parentElement || nativeRoot;
}

function clickNative(node: Element, fallbackHref?: string): void {
  const target = findActivationTarget(node) || (node instanceof HTMLElement ? node : null);

  if (target) {
    target.click();
    return;
  }

  if (fallbackHref) {
    window.location.href = fallbackHref;
  }
}

function proxyClick(proxy: Element, nativeNode: Element, fallbackHref?: string): void {
  proxy.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    clickNative(findEquivalentElement(event.target, proxy, nativeNode), fallbackHref);
  });
}

export function isInsideMovedNode(state: ToolkitState, node: Element): boolean {
  return state.movedItems.some((item) => item.node.contains(node));
}

export function moveInto(
  state: ToolkitState,
  node: Element | null,
  destination: Element,
  key: string,
  _label: string,
): boolean {
  if (!node || !node.parentNode || isInsideMovedNode(state, node)) {
    return false;
  }

  const placeholder = document.createComment(`zhihu-web-toolkit:${key}`);
  node.parentNode.insertBefore(placeholder, node);
  node.setAttribute(MOVED_ITEM_ATTR, key);

  destination.appendChild(node);
  state.movedItems.push({ key, node, placeholder });
  return true;
}

export function appendProxy(
  node: Element | null,
  destination: Element,
  key: string,
  label: string,
  fallbackHref?: string,
): boolean {
  if (!node) {
    return false;
  }

  const proxy = cloneHeaderItem(node, key, label);
  const href = getHref(proxy) || getHref(node) || fallbackHref;

  if (href && proxy instanceof HTMLAnchorElement && !proxy.href) {
    proxy.href = href;
  }

  if (key === "search") {
    proxySearch(proxy as HTMLElement, node);
  } else {
    proxyClick(proxy, node, fallbackHref);
  }

  destination.appendChild(proxy);
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

export function appendItem(
  state: ToolkitState,
  header: Element,
  destination: Element,
  item: HeaderItemConfig,
): void {
  const node = item.find(header);

  if (MOVED_NATIVE_ITEM_KEYS.has(item.key) && moveInto(state, node, destination, item.key, item.label)) {
    return;
  }

  if (appendProxy(node, destination, item.key, item.label, item.fallbackHref)) {
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

  appendProxy(ruapjk, destination, "ruapjk", "顶部按钮");
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
  if (originalHeader.parentNode) {
    originalHeader.parentNode.insertBefore(header, originalHeader.nextSibling);
    return;
  }

  document.body.insertBefore(header, document.body.firstChild);
}

export function buildToolkitHeader(state: ToolkitState, originalHeader: Element): HeaderShell {
  const shell = createHeaderShell();
  const searchNode = findSearchControl(originalHeader);

  HEADER_ITEMS.forEach((item) => appendItem(state, originalHeader, shell.nav, item));

  if (searchNode) {
    appendProxy(searchNode, shell.search, "search", "搜索");
  } else {
    state.missing.push("search");
  }

  ACTION_ITEMS.forEach((item) => appendItem(state, originalHeader, shell.actions, item));
  moveExtraHeaderControls(state, originalHeader, shell.actions);

  return shell;
}
