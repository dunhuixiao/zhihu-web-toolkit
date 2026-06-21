import { MOVED_ITEM_ATTR } from "../../shared/constants";
import { clearFixedPosition, readText } from "../../shared/dom";
import type { ToolkitState } from "../../shared/state";

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

export function cloneHeaderItem(state: ToolkitState, node: Element, key: string, label: string): Element {
  const proxy = node.cloneNode(true) as Element;
  stripDuplicateIds(proxy);
  prepareHeaderItem(proxy, key, label);
  syncClonedImages(node, proxy);
  watchClonedImages(state, node, proxy);

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

function syncClonedImages(sourceRoot: Element, proxyRoot: Element): void {
  const sourceImages =
    sourceRoot instanceof HTMLImageElement ? [sourceRoot] : Array.from(sourceRoot.querySelectorAll("img"));
  const proxyImages = proxyRoot instanceof HTMLImageElement ? [proxyRoot] : Array.from(proxyRoot.querySelectorAll("img"));

  sourceImages.forEach((sourceImage, index) => {
    const proxyImage = proxyImages[index];
    const source = sourceImage.currentSrc || sourceImage.src || sourceImage.getAttribute("src");
    const alt = sourceImage.getAttribute("alt");

    if (proxyImage && source) {
      proxyImage.removeAttribute("srcset");
      proxyImage.src = source;
      proxyImage.setAttribute("src", source);
      if (alt) {
        proxyImage.setAttribute("alt", alt);
      }
    }
  });
}

function watchClonedImages(state: ToolkitState, sourceRoot: Element, proxyRoot: Element): void {
  const sourceImages =
    sourceRoot instanceof HTMLImageElement ? [sourceRoot] : Array.from(sourceRoot.querySelectorAll("img"));
  const proxyImages = proxyRoot instanceof HTMLImageElement ? [proxyRoot] : Array.from(proxyRoot.querySelectorAll("img"));

  sourceImages.forEach((sourceImage, index) => {
    const proxyImage = proxyImages[index];
    if (!proxyImage) {
      return;
    }

    const sync = () => syncClonedImages(sourceRoot, proxyRoot);
    const observer = new MutationObserver(sync);
    observer.observe(sourceImage, {
      attributes: true,
      attributeFilter: ["src", "srcset", "alt"],
    });
    sourceImage.addEventListener("load", sync);
    state.cleanupCallbacks.push(() => {
      observer.disconnect();
      sourceImage.removeEventListener("load", sync);
    });
  });
}
