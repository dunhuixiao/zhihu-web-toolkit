import { getHref, includesAny, readMetaText, readText } from "../../shared/dom";

export interface HeaderControlOptions {
  texts?: readonly string[];
  ariaParts?: readonly string[];
  classParts?: readonly string[];
  hrefParts?: readonly string[];
}

export interface HeaderItemConfig {
  key: string;
  label: string;
  fallbackHref?: string;
  find: (header: Element) => Element | null;
}

export function toTightControl(element: Element | null, header: Element): Element | null {
  if (!element || !header.contains(element)) {
    return null;
  }

  return element.closest("a,button,[role='button']") || element.closest(".AppHeader-profile") || element;
}

export function isUsableControl(element: Element | null): boolean {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const style = getComputedStyle(element);
  const zIndex = Number.parseInt(style.zIndex, 10);
  const className = String(element.className || "");

  if (className.includes("creatorHintPopover") || className.includes("CreatorHint")) {
    return false;
  }

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.pointerEvents !== "none" &&
    (Number.isNaN(zIndex) || zIndex >= 0)
  );
}

function firstUsableProfileControl(header: Element): Element | null {
  const candidates = Array.from(
    header.querySelectorAll(".AppHeader-profileEntry, .AppHeader-profile, .AppHeader-profileAvatar, img.Avatar"),
  );

  for (const candidate of candidates) {
    const control = toTightControl(candidate, header);
    if (isUsableControl(control) && control?.querySelector(".Avatar, .AppHeader-profileAvatar, img")) {
      return control;
    }
  }

  return firstUsableControl(header, [
    header.querySelector("[aria-label*='个人']"),
    header.querySelector("[aria-label*='头像']"),
    header.querySelector("[class*='Profile']"),
  ]);
}

export function firstUsableControl(header: Element, candidates: Array<Element | null>): Element | null {
  for (const candidate of candidates) {
    const control = toTightControl(candidate, header);
    if (isUsableControl(control)) {
      return control;
    }
  }

  return null;
}

export function findHeaderControl(header: Element, options: HeaderControlOptions): Element | null {
  const candidates = Array.from(header.querySelectorAll("a,button,[role='button'],[aria-label],[title]"));

  for (const candidate of candidates) {
    const text = readText(candidate);
    const meta = readMetaText(candidate);
    const href = getHref(candidate);
    const className = String(candidate.className || "");

    if ((options.texts || []).includes(text)) {
      return toTightControl(candidate, header);
    }

    if (includesAny(meta, options.ariaParts)) {
      return toTightControl(candidate, header);
    }

    if (includesAny(className, options.classParts)) {
      return toTightControl(candidate, header);
    }

    if (includesAny(href, options.hrefParts)) {
      return toTightControl(candidate, header);
    }
  }

  return null;
}

export const HEADER_ITEMS: HeaderItemConfig[] = [
  {
    key: "home",
    label: "知乎主页",
    fallbackHref: "https://www.zhihu.com/",
    find: (header) =>
      header.querySelector("a.AppHeader-logo") ||
      header.querySelector("a[aria-label*='知乎']") ||
      header.querySelector("a[title*='知乎']") ||
      toTightControl(header.querySelector("svg[class*='Logo'], svg[class*='logo']"), header),
  },
  {
    key: "follow",
    label: "关注",
    fallbackHref: "https://www.zhihu.com/following",
    find: (header) =>
      findHeaderControl(header, {
        texts: ["关注"],
        hrefParts: ["/following", "/follow"],
      }),
  },
  {
    key: "recommend",
    label: "推荐",
    fallbackHref: "https://www.zhihu.com/",
    find: (header) =>
      findHeaderControl(header, {
        texts: ["推荐"],
        hrefParts: ["/recommend"],
      }),
  },
  {
    key: "hot",
    label: "热榜",
    fallbackHref: "https://www.zhihu.com/hot",
    find: (header) =>
      findHeaderControl(header, {
        texts: ["热榜"],
        hrefParts: ["/hot"],
      }),
  },
];

export const ACTION_ITEMS: HeaderItemConfig[] = [
  {
    key: "messages",
    label: "消息",
    fallbackHref: "https://www.zhihu.com/notifications",
    find: (header) =>
      firstUsableControl(header, [header.querySelector(".AppHeader-messages")]) ||
      findHeaderControl(header, {
        texts: ["消息", "通知"],
        ariaParts: ["消息", "通知"],
        classParts: ["Messages", "Notification"],
        hrefParts: ["/notifications", "/messages"],
      }),
  },
  {
    key: "inbox",
    label: "私信",
    fallbackHref: "https://www.zhihu.com/messages",
    find: (header) =>
      firstUsableControl(header, [header.querySelector(".AppHeader-inbox")]) ||
      findHeaderControl(header, {
        texts: ["私信"],
        ariaParts: ["私信"],
        classParts: ["Inbox"],
        hrefParts: ["/messages", "/inbox"],
      }),
  },
  {
    key: "profile",
    label: "个人信息",
    find: (header) => firstUsableProfileControl(header),
  },
];
