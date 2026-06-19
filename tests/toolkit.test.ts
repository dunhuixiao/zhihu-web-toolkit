import { describe, expect, it } from "vitest";
import {
  AD_SELECTORS,
  FLOATING_BUTTON_ACTIVE_CLASS,
  FLOATING_CONTROLS_ID,
  HEADER_ATTR,
  HIDE_SELECTORS,
  MOVED_ITEM_ATTR,
  STYLE_ID,
  THEME_BUTTON_ID,
  WORD_BLOCK_BUTTON_ID,
} from "../src/shared/constants";
import { createToolkit, installToolkit } from "../src/toolkit";
import { createZhihuFixture } from "./fixtures";

function visibleCount(selector: string): number {
  return Array.from(document.querySelectorAll(selector)).filter((element) => {
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }).length;
}

describe("zhihu-web-toolkit", () => {
  it("injects hide rules for configured selectors", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    const report = toolkit.apply();
    const style = document.getElementById(STYLE_ID);

    expect(style?.textContent).toContain("div.css-1g41cri");
    expect(style?.textContent).toContain("div.Card.TopstoryItem.TopstoryItem--advertCard");
    expect(style?.textContent).toContain("header.AppHeader:not");
    expect(report.hiddenTargets.map((item) => item.selector)).toEqual([...HIDE_SELECTORS]);
    expect(report.hiddenAds.map((item) => item.selector)).toEqual([...AD_SELECTORS]);
    expect(report.hiddenTargets.every((item) => item.visibleCount === 0)).toBe(true);
    expect(report.hiddenAds.every((item) => item.visibleCount === 0)).toBe(true);
  });

  it("hides the original header while keeping the rebuilt header visible", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    toolkit.apply();

    expect(document.querySelectorAll(`header[${HEADER_ATTR}='true']`)).toHaveLength(1);
    expect(visibleCount("header.AppHeader:not([data-zhihu-web-toolkit-header='true'])")).toBe(0);
    expect(getComputedStyle(document.querySelector(`header[${HEADER_ATTR}='true']`)!).display).not.toBe("none");
  });

  it("moves expected header controls and css-ruapjk into the rebuilt header", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    const report = toolkit.apply();
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;
    const keys = Array.from(rebuilt.querySelectorAll(`[${MOVED_ITEM_ATTR}]`)).map((element) =>
      element.getAttribute(MOVED_ITEM_ATTR),
    );

    expect(keys).toEqual(["home", "follow", "recommend", "hot", "search", "messages", "inbox", "profile", "ruapjk"]);
    expect(rebuilt.querySelector(".css-ruapjk")).not.toBeNull();
    expect(report.ruapjkMoved).toBe(true);
    expect(report.missing).toEqual([]);
  });

  it("is idempotent when apply is called repeatedly", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    toolkit.apply();
    toolkit.apply();

    expect(document.querySelectorAll(`header[${HEADER_ATTR}='true']`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${STYLE_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${FLOATING_CONTROLS_ID}`)).toHaveLength(1);
  });

  it("destroy restores moved nodes and removes injected artifacts", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    toolkit.apply();
    toolkit.destroy();

    expect(document.querySelector(`header[${HEADER_ATTR}='true']`)).toBeNull();
    expect(document.getElementById(FLOATING_CONTROLS_ID)).toBeNull();
    expect(document.getElementById(STYLE_ID)).toBeNull();
    expect(document.querySelector("header.AppHeader .SearchBar")).not.toBeNull();
    expect(document.querySelector("header.AppHeader .css-ruapjk")).not.toBeNull();
    expect(visibleCount("div.Card.TopstoryItem.TopstoryItem--advertCard")).toBe(1);
  });

  it("mounts floating theme and word block buttons", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    const report = toolkit.apply();
    const controls = document.getElementById(FLOATING_CONTROLS_ID);
    const themeButton = document.getElementById(THEME_BUTTON_ID);
    const wordBlockButton = document.getElementById(WORD_BLOCK_BUTTON_ID);
    const style = document.getElementById(STYLE_ID);

    expect(controls).not.toBeNull();
    expect(controls?.children).toHaveLength(2);
    expect(themeButton).not.toBeNull();
    expect(wordBlockButton).not.toBeNull();
    expect(themeButton?.getAttribute("title")).toBe("切换到暗黑模式");
    expect(themeButton?.getAttribute("aria-pressed")).toBe("false");
    expect(wordBlockButton?.getAttribute("title")).toBe("屏蔽词管理");
    expect(style?.textContent).toContain("width: 38px");
    expect(style?.textContent).toContain("bottom: 30px");
    expect(style?.textContent).toContain("var(--GBK99A, #fff)");
    expect(report.floatingControlsFound).toBe(true);
    expect(report.wordBlockButtonFound).toBe(true);
    expect(report.themeMode).toBe("light");
  });

  it("toggles Zhihu theme immediately and syncs the URL query", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    toolkit.apply();
    const themeButton = document.getElementById(THEME_BUTTON_ID)!;

    themeButton.click();

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(location.search).toBe("?theme=dark");
    expect(themeButton.classList.contains(FLOATING_BUTTON_ACTIVE_CLASS)).toBe(true);
    expect(themeButton.getAttribute("title")).toBe("切换到白天模式");
    expect(themeButton.getAttribute("aria-pressed")).toBe("true");
    expect(toolkit.report().themeMode).toBe("dark");

    themeButton.click();

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(location.search).toBe("?theme=light");
    expect(themeButton.classList.contains(FLOATING_BUTTON_ACTIVE_CLASS)).toBe(false);
    expect(themeButton.getAttribute("title")).toBe("切换到暗黑模式");
    expect(themeButton.getAttribute("aria-pressed")).toBe("false");
    expect(toolkit.report().themeMode).toBe("light");
  });

  it("keeps the word block manager button as a display-only placeholder", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    toolkit.apply();
    const beforeHtml = document.body.innerHTML;

    document.getElementById(WORD_BLOCK_BUTTON_ID)!.click();

    expect(console.info).toHaveBeenCalledWith("[zhihu-web-toolkit] Word block manager is not implemented yet.");
    expect(document.body.innerHTML).toBe(beforeHtml);
  });

  it("exposes only the zhihu-web-toolkit debug API", () => {
    createZhihuFixture();

    const api = installToolkit();

    expect(window.__zhihuWebToolkit).toBe(api);
    expect(Object.keys(window).filter((key) => key.startsWith("__zhihu"))).toEqual(["__zhihuWebToolkit"]);
  });
});
