import { APP_ROOT_SELECTORS, HEADER_ATTR } from "../../shared/constants";
import { ACTION_ITEMS, HEADER_ITEMS } from "./config";
import { findSearchControl } from "./search-proxy";

const ORIGINAL_HEADER_SELECTORS = [
  `header.AppHeader:not([${HEADER_ATTR}='true'])`,
  `.AppHeader:not([${HEADER_ATTR}='true'])`,
] as const;
const GENERIC_HEADER_SELECTOR = `header:not([${HEADER_ATTR}='true'])`;

export function findOriginalHeader(): Element | null {
  const appHeader = findFirstHeader(document, ORIGINAL_HEADER_SELECTORS);
  if (appHeader) {
    return appHeader;
  }

  for (const root of headerSearchRoots()) {
    const genericHeader = findLikelyZhihuHeader(root);
    if (genericHeader) {
      return genericHeader;
    }
  }

  return null;
}

function findFirstHeader(root: ParentNode, selectors: readonly string[]): Element | null {
  for (const selector of selectors) {
    const header = root.querySelector(selector);
    if (header) {
      return header;
    }
  }

  return null;
}

function headerSearchRoots(): ParentNode[] {
  const roots = APP_ROOT_SELECTORS.map((selector) => document.querySelector(selector)).filter(
    (root): root is Element => Boolean(root),
  );

  return roots.length > 0 ? roots : [document.body || document.documentElement];
}

function findLikelyZhihuHeader(root: ParentNode): Element | null {
  for (const header of Array.from(root.querySelectorAll(GENERIC_HEADER_SELECTOR))) {
    if (hasZhihuHeaderSignals(header)) {
      return header;
    }
  }

  return null;
}

function hasZhihuHeaderSignals(header: Element): boolean {
  const hasSearch = Boolean(findSearchControl(header));
  const hasNavItem = HEADER_ITEMS.some((item) => Boolean(item.find(header)));
  const hasActionItem = ACTION_ITEMS.some((item) => Boolean(item.find(header)));
  const hasKnownClass = Boolean(
    header.querySelector(
      "a.AppHeader-logo,.SearchBar,.AppHeader-messages,.AppHeader-inbox,.AppHeader-profileEntry,.AppHeader-profile",
    ),
  );

  return [hasSearch, hasNavItem, hasActionItem, hasKnownClass].filter(Boolean).length >= 2;
}
