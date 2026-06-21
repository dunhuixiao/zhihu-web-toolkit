import { getHref } from "../../shared/dom";
import type { ToolkitState } from "../../shared/state";
import { cloneHeaderItem } from "./clone";
import { proxySearch } from "./search-proxy";

const ACTIVATION_SELECTOR = "a,button,input,textarea,select,[role='button'],[tabindex]";
const NAVIGATION_ITEM_KEYS = new Set(["home", "follow", "recommend", "hot"]);
const NATIVE_POPOVER_ITEM_KEYS = new Set(["messages", "inbox", "profile"]);

export type CurrentNativeNodeResolver = (key: string, initialNode: Element) => Element;

export interface ProxyOptions {
  resolveNativeNode?: CurrentNativeNodeResolver;
}

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

function bindNativeGeometryToProxy(state: ToolkitState, nativeNode: Element, proxy: Element): void {
  if (!(nativeNode instanceof HTMLElement) || !(proxy instanceof HTMLElement)) {
    return;
  }

  const originalGetBoundingClientRect = nativeNode.getBoundingClientRect;
  nativeNode.getBoundingClientRect = () => proxy.getBoundingClientRect();
  state.geometryRestorers.push(() => {
    nativeNode.getBoundingClientRect = originalGetBoundingClientRect;
  });
}

function withNativeGeometry(nativeNode: Element, proxy: Element, action: () => void): void {
  if (!(nativeNode instanceof HTMLElement) || !(proxy instanceof HTMLElement)) {
    action();
    return;
  }

  const originalGetBoundingClientRect = nativeNode.getBoundingClientRect;
  nativeNode.getBoundingClientRect = () => proxy.getBoundingClientRect();
  try {
    action();
  } finally {
    nativeNode.getBoundingClientRect = originalGetBoundingClientRect;
  }
}

function proxyClick(proxy: Element, nativeNode: Element, fallbackHref?: string): void {
  proxy.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    clickNative(findEquivalentElement(event.target, proxy, nativeNode), fallbackHref);
  });
}

function proxyNativePopoverClick(
  state: ToolkitState,
  proxy: Element,
  nativeNode: Element,
  key: string,
  fallbackHref?: string,
  resolveNativeNode?: CurrentNativeNodeResolver,
): void {
  bindNativeGeometryToProxy(state, nativeNode, proxy);
  proxy.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const currentNativeNode = resolveNativeNode?.(key, nativeNode) || nativeNode;
    withNativeGeometry(currentNativeNode, proxy, () => clickNative(currentNativeNode, fallbackHref));
  });
}

function createNavigationProxy(proxy: Element, href: string): HTMLAnchorElement {
  const link = document.createElement("a");

  Array.from(proxy.attributes).forEach((attribute) => {
    if (!["href", "type", "disabled"].includes(attribute.name)) {
      link.setAttribute(attribute.name, attribute.value);
    }
  });
  while (proxy.firstChild) {
    link.appendChild(proxy.firstChild);
  }

  link.href = href;
  link.setAttribute("href", href);
  return link;
}

function normalizeProxyNavigation(proxy: Element, node: Element, fallbackHref?: string): Element | null {
  const href = getHref(node) || getHref(proxy) || fallbackHref;

  if (!href) {
    return null;
  }

  const navigationTarget = proxy instanceof HTMLAnchorElement ? proxy : proxy.querySelector("a");

  if (navigationTarget instanceof HTMLAnchorElement) {
    navigationTarget.href = href;
    navigationTarget.setAttribute("href", href);
    return proxy;
  }

  return createNavigationProxy(proxy, href);
}

export function appendProxy(
  state: ToolkitState,
  node: Element | null,
  destination: Element,
  key: string,
  label: string,
  fallbackHref?: string,
  options: ProxyOptions = {},
): boolean {
  if (!node) {
    return false;
  }

  let proxy = cloneHeaderItem(state, node, key, label);
  const href = getHref(proxy) || getHref(node) || fallbackHref;

  if (href && proxy instanceof HTMLAnchorElement && !proxy.href) {
    proxy.href = href;
  }

  if (key === "search") {
    proxySearch(proxy as HTMLElement, node);
  } else if (NAVIGATION_ITEM_KEYS.has(key)) {
    // Let navigation proxies use their own href so hidden native React controls are not clicked.
    proxy = normalizeProxyNavigation(proxy, node, fallbackHref) || proxy;
  } else if (NATIVE_POPOVER_ITEM_KEYS.has(key)) {
    proxyNativePopoverClick(state, proxy, node, key, fallbackHref, options.resolveNativeNode);
  } else {
    proxyClick(proxy, node, fallbackHref);
  }

  destination.appendChild(proxy);
  return true;
}
