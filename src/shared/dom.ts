export function normalizeText(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, "").trim();
}

export function readText(element: Element | null | undefined): string {
  if (!element) {
    return "";
  }

  return normalizeText(element instanceof HTMLElement ? element.innerText || element.textContent : element.textContent);
}

export function readMetaText(element: Element | null | undefined): string {
  if (!element) {
    return "";
  }

  return normalizeText(
    [
      element.getAttribute("aria-label"),
      element.getAttribute("title"),
      element.getAttribute("alt"),
      element.getAttribute("placeholder"),
      readText(element),
    ].join(" "),
  );
}

export function includesAny(value: unknown, parts: readonly string[] = []): boolean {
  const text = String(value ?? "");
  return parts.some((part) => text.includes(part));
}

export function isZhihuHost(locationLike: Pick<Location, "hostname"> = window.location): boolean {
  return /(^|\.)zhihu\.com$/i.test(locationLike.hostname);
}

export function getHref(element: Element | null | undefined): string {
  if (!element) {
    return "";
  }

  return element.getAttribute("href") || ("href" in element ? String(element.href || "") : "");
}

export function visibleCount(selector: string, root: ParentNode = document): number {
  return Array.from(root.querySelectorAll(selector)).filter((element) => {
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }).length;
}

export function clearFixedPosition(element: HTMLElement | null | undefined): void {
  if (!element) {
    return;
  }

  element.style.setProperty("position", "static", "important");
  element.style.setProperty("top", "auto", "important");
  element.style.setProperty("transform", "none", "important");
}
