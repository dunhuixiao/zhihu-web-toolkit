import { describe, expect, it, vi } from "vitest";
import { setNativeThemeReloader } from "../src/features/floating-controls/floating-controls";
import {
  AD_SELECTORS,
  BACK_TO_TOP_BUTTON_ID,
  FLOATING_BUTTON_ACTIVE_CLASS,
  FLOATING_CONTROLS_ID,
  HEADER_ATTR,
  HIDE_SELECTORS,
  MOVED_ITEM_ATTR,
  NATIVE_BACK_TO_TOP_SELECTORS,
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

interface TestReactFiber {
  child?: TestReactFiber;
  memoizedProps?: {
    value?: unknown;
  };
  return?: TestReactFiber;
  sibling?: TestReactFiber;
  tag?: number;
}

function installZhihuThemeFiber(setDarkTheme: (isDarkTheme: boolean) => void): void {
  const rootElement = document.getElementById("root")!;
  const rootFiber: TestReactFiber = { tag: 3 };
  const userAgentProvider: TestReactFiber = {
    memoizedProps: {
      value: {
        Mobile: false,
        Wechat: false,
        Zhihu: false,
      },
    },
    return: rootFiber,
    tag: 10,
  };
  const themeValueProvider: TestReactFiber = {
    memoizedProps: { value: false },
    return: userAgentProvider,
    tag: 10,
  };
  const themeSetterProvider: TestReactFiber = {
    memoizedProps: { value: setDarkTheme },
    return: themeValueProvider,
    tag: 10,
  };

  rootFiber.child = userAgentProvider;
  userAgentProvider.child = themeValueProvider;
  themeValueProvider.child = themeSetterProvider;

  Object.defineProperty(rootElement, "__reactContainer$test", {
    configurable: true,
    value: rootFiber,
  });
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
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;
    const original = document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true'])")!;
    const originalContainer = original.parentElement!;

    expect(document.querySelectorAll(`header[${HEADER_ATTR}='true']`)).toHaveLength(1);
    expect(rebuilt.classList.contains("AppHeader")).toBe(true);
    expect(rebuilt.classList.contains("zhihu-web-toolkit-header")).toBe(true);
    expect(rebuilt.parentElement).toBe(originalContainer);
    expect(document.getElementById("root")?.contains(rebuilt)).toBe(true);
    expect(original.nextElementSibling).toBe(rebuilt);
    expect(visibleCount("header.AppHeader:not([data-zhihu-web-toolkit-header='true'])")).toBe(0);
    expect(originalContainer.getAttribute("data-zhihu-web-toolkit-container")).toBe("true");
    expect((originalContainer as HTMLElement).style.position).toBe("static");
    expect(getComputedStyle(rebuilt).display).not.toBe("none");
  });

  it("rebuilds expected header controls while moving native popover triggers", () => {
    createZhihuFixture();

    const nativeMessages = document.querySelector<HTMLElement>("#root header.AppHeader .AppHeader-messages")!;
    const nativeInbox = document.querySelector<HTMLElement>("#root header.AppHeader .AppHeader-inbox")!;
    const nativeProfile = document.querySelector<HTMLElement>("#root header.AppHeader .AppHeader-profileEntry")!;
    const toolkit = createToolkit();
    const report = toolkit.apply();
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;
    const original = document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true'])")!;
    const rebuiltMessages = rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='messages']`);
    const rebuiltInbox = rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='inbox']`);
    const rebuiltProfile = rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='profile']`);
    const keys = Array.from(rebuilt.querySelectorAll(`[${MOVED_ITEM_ATTR}]`)).map((element) =>
      element.getAttribute(MOVED_ITEM_ATTR),
    );

    expect(keys).toEqual(["home", "follow", "recommend", "hot", "search", "messages", "inbox", "profile", "ruapjk"]);
    expect(rebuiltMessages).toBe(nativeMessages);
    expect(rebuiltInbox).toBe(nativeInbox);
    expect(rebuiltProfile).toBe(nativeProfile);
    expect(rebuilt.querySelector(".css-ruapjk")).not.toBeNull();
    expect(original.querySelector(".SearchBar")).not.toBeNull();
    expect(original.querySelector(".css-ruapjk")).not.toBeNull();
    expect(original.querySelector(".AppHeader-messages")).toBeNull();
    expect(original.querySelector(".AppHeader-inbox")).toBeNull();
    expect(original.querySelector(".AppHeader-profileEntry")).toBeNull();
    expect(report.ruapjkMoved).toBe(true);
    expect(report.missing).toEqual([]);
  });

  it("keeps rebuilt header controls interactive through proxies and moved native triggers", () => {
    createZhihuFixture();

    const searchSpy = vi.fn((event: Event) => event.preventDefault());
    const inputSpy = vi.fn();
    const messagesSpy = vi.fn((event: MouseEvent) => event.preventDefault());
    const inboxSpy = vi.fn((event: MouseEvent) => event.preventDefault());
    const profileSpy = vi.fn();

    const nativeSearch = document.querySelector<HTMLFormElement>(".SearchBar")!;
    nativeSearch.addEventListener("submit", searchSpy);
    nativeSearch.querySelector("input")!.addEventListener("input", inputSpy);
    const nativeMessages = document.querySelector<HTMLButtonElement>("#root header.AppHeader .AppHeader-messages")!;
    const nativeInbox = document.querySelector<HTMLButtonElement>("#root header.AppHeader .AppHeader-inbox")!;
    const nativeProfile = document.querySelector<HTMLButtonElement>("#root header.AppHeader .AppHeader-profile")!;
    nativeMessages.addEventListener("click", messagesSpy);
    nativeInbox.addEventListener("click", inboxSpy);
    nativeProfile.addEventListener("click", profileSpy);

    const toolkit = createToolkit();
    toolkit.apply();
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;
    const proxySearch = rebuilt.querySelector<HTMLFormElement>(".SearchBar")!;

    proxySearch.querySelector("input")!.value = "测试搜索";
    proxySearch.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    rebuilt.querySelector<HTMLElement>("[data-zhihu-web-toolkit-item='messages']")!.click();
    rebuilt.querySelector<HTMLElement>("[data-zhihu-web-toolkit-item='inbox']")!.click();
    rebuilt.querySelector<HTMLElement>("[data-zhihu-web-toolkit-item='profile']")!.click();

    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .SearchBar"),
    ).toBe(nativeSearch);
    expect(nativeSearch.querySelector("input")!.value).toBe("测试搜索");
    expect(searchSpy).toHaveBeenCalledOnce();
    expect(inputSpy).toHaveBeenCalledOnce();
    expect(rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='messages']`)).toBe(nativeMessages);
    expect(rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='inbox']`)).toBe(nativeInbox);
    expect(rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='profile']`)).toBe(nativeProfile);
    expect(messagesSpy).toHaveBeenCalledOnce();
    expect(inboxSpy).toHaveBeenCalledOnce();
    expect(profileSpy).toHaveBeenCalledOnce();
  });

  it("uses the real profile entry instead of Zhihu's hidden creator hint popover", () => {
    createZhihuFixture();
    const originalProfile = document.querySelector(".AppHeader-profile")!;
    originalProfile.insertAdjacentHTML(
      "beforebegin",
      `<div class="Popover AppHeaderProfileMenu-creatorHintPopover" aria-label="个人信息" title="个人信息" style="position: absolute; z-index: -1;">
        <div class="AppHeaderProfileMenu-creatorHintToggler"></div>
      </div>
      <button class="Button AppHeader-profileEntry" type="button">
        <img class="Avatar AppHeader-profileAvatar" alt="点击打开用户的主页" />
      </button>`,
    );
    originalProfile.remove();

    const profileSpy = vi.fn();
    const nativeProfile = document.querySelector<HTMLButtonElement>("#root header.AppHeader .AppHeader-profileEntry")!;
    nativeProfile.addEventListener("click", profileSpy);

    const toolkit = createToolkit();
    toolkit.apply();
    const rebuiltProfile = document.querySelector<HTMLElement>(
      `header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='profile']`,
    )!;

    expect(rebuiltProfile).toBe(nativeProfile);
    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .AppHeader-profileEntry"),
    ).toBeNull();
    expect(rebuiltProfile.tagName).toBe("BUTTON");
    expect(rebuiltProfile.classList.contains("AppHeader-profileEntry")).toBe(true);
    expect(rebuiltProfile.classList.contains("AppHeaderProfileMenu-creatorHintPopover")).toBe(false);

    rebuiltProfile.click();

    expect(profileSpy).toHaveBeenCalledOnce();
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

  it("waits for a late-rendered Zhihu header", async () => {
    document.body.innerHTML = `
      <div id="root">
        <main>
          <div class="Card css-173vipd">vip</div>
        </main>
      </div>
    `;

    const toolkit = createToolkit();
    const initialReport = toolkit.apply();

    expect(initialReport.active).toBe(false);
    expect(document.querySelector(`header[${HEADER_ATTR}='true']`)).toBeNull();

    document.getElementById("root")!.insertAdjacentHTML(
      "afterbegin",
      `<div class="css-s8xum0">
        <header class="AppHeader">
          <a class="AppHeader-logo" href="https://www.zhihu.com/" aria-label="知乎">知乎</a>
          <a href="https://www.zhihu.com/follow">关注</a>
          <a href="https://www.zhihu.com/">推荐</a>
          <a href="https://www.zhihu.com/hot">热榜</a>
          <form class="SearchBar"><input placeholder="搜索知乎内容" /></form>
          <button class="Button AppHeader-messages" type="button" aria-label="消息">消息</button>
          <button class="Button AppHeader-inbox" type="button" aria-label="私信">私信</button>
          <button class="Button AppHeader-profileEntry AppHeader-profile" type="button" aria-label="个人信息">
            <img class="Avatar AppHeader-profileAvatar" alt="点击打开用户的主页" />
          </button>
          <div class="css-ruapjk"></div>
        </header>
      </div>`,
    );
    await vi.waitFor(() => expect(document.querySelectorAll(`header[${HEADER_ATTR}='true']`)).toHaveLength(1));

    const report = toolkit.report();
    expect(report.active).toBe(true);
    expect(report.rebuiltHeaderFound).toBe(true);
    expect(report.ruapjkMoved).toBe(true);
  });

  it("destroy restores moved nodes and removes injected artifacts", () => {
    createZhihuFixture();

    const originalHeader = document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true'])")!;
    const nativeMessages = document.querySelector("#root header.AppHeader .AppHeader-messages")!;
    const nativeInbox = document.querySelector("#root header.AppHeader .AppHeader-inbox")!;
    const nativeProfile = document.querySelector("#root header.AppHeader .AppHeader-profileEntry")!;
    const toolkit = createToolkit();
    toolkit.apply();

    expect(document.querySelector(`header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='messages']`)).toBe(nativeMessages);
    expect(document.querySelector(`header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='inbox']`)).toBe(nativeInbox);
    expect(document.querySelector(`header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='profile']`)).toBe(nativeProfile);
    expect(originalHeader.querySelector(".AppHeader-messages")).toBeNull();
    expect(originalHeader.querySelector(".AppHeader-inbox")).toBeNull();
    expect(originalHeader.querySelector(".AppHeader-profileEntry")).toBeNull();

    toolkit.destroy();

    expect(document.querySelector(`header[${HEADER_ATTR}='true']`)).toBeNull();
    expect(document.getElementById(FLOATING_CONTROLS_ID)).toBeNull();
    expect(document.getElementById(STYLE_ID)).toBeNull();
    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .SearchBar"),
    ).not.toBeNull();
    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .css-ruapjk"),
    ).not.toBeNull();
    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .AppHeader-messages"),
    ).toBe(nativeMessages);
    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .AppHeader-inbox"),
    ).toBe(nativeInbox);
    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .AppHeader-profileEntry"),
    ).toBe(nativeProfile);
    expect(visibleCount("div.Card.TopstoryItem.TopstoryItem--advertCard")).toBe(1);
  });

  it("mounts floating theme and word block buttons", () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    const report = toolkit.apply();
    const controls = document.getElementById(FLOATING_CONTROLS_ID);
    const themeButton = document.getElementById(THEME_BUTTON_ID);
    const wordBlockButton = document.getElementById(WORD_BLOCK_BUTTON_ID);
    const backToTopButton = document.getElementById(BACK_TO_TOP_BUTTON_ID);
    const style = document.getElementById(STYLE_ID);

    expect(controls).not.toBeNull();
    expect(controls?.children).toHaveLength(3);
    expect(controls?.children[0]).toBe(wordBlockButton);
    expect(controls?.children[1]).toBe(themeButton);
    expect(controls?.children[2]).toBe(backToTopButton);
    expect(themeButton).not.toBeNull();
    expect(wordBlockButton).not.toBeNull();
    expect(backToTopButton).not.toBeNull();
    expect(themeButton?.getAttribute("title")).toBe("切换到暗黑模式");
    expect(themeButton?.getAttribute("alt")).toBe("切换到暗黑模式");
    expect(themeButton?.getAttribute("aria-pressed")).toBe("false");
    expect(wordBlockButton?.getAttribute("title")).toBe("屏蔽词管理");
    expect(wordBlockButton?.getAttribute("alt")).toBe("屏蔽词管理");
    expect(wordBlockButton?.querySelector("svg")?.getAttribute("alt")).toBe("屏蔽词管理");
    expect(backToTopButton?.getAttribute("title")).toBe("回到顶部");
    expect(backToTopButton?.getAttribute("alt")).toBe("回到顶部");
    expect(style?.textContent).toContain("width: 38px");
    expect(style?.textContent).toContain("bottom: 30px");
    expect(style?.textContent).toContain("var(--GBK99A, #fff)");
    expect(style?.textContent).toContain("html[data-theme='dark'] header");
    expect(style?.textContent).toContain("var(--GBK99A, #1a1a1a)");
    expect(style?.textContent).toContain(`header[${HEADER_ATTR}='true'] input`);
    expect(style?.textContent).toContain(".AppHeader-profileAvatar");
    expect(style?.textContent).toContain(`[${MOVED_ITEM_ATTR}='recommend']`);
    expect(style?.textContent).toContain(NATIVE_BACK_TO_TOP_SELECTORS[0]);
    expect(style?.textContent).not.toContain(`header[${HEADER_ATTR}='true'] svg`);
    expect(style?.textContent).not.toContain("color: var(--GBK04A, #121212) !important;\n  text-decoration");
    expect(report.floatingControlsFound).toBe(true);
    expect(report.wordBlockButtonFound).toBe(true);
    expect(report.themeMode).toBe("light");
  });

  it("proxies the custom back-to-top button to Zhihu's native button", () => {
    createZhihuFixture();

    const nativeButton = document.querySelector<HTMLButtonElement>(".CornerButton")!;
    const nativeClick = vi.fn();
    nativeButton.addEventListener("click", nativeClick);

    const toolkit = createToolkit();
    toolkit.apply();

    document.getElementById(BACK_TO_TOP_BUTTON_ID)!.click();

    expect(nativeClick).toHaveBeenCalledOnce();
    expect(visibleCount(".CornerButton")).toBe(0);
  });

  it("switches Zhihu theme through Zhihu's native React theme provider without reload", () => {
    createZhihuFixture();

    const reloadSpy = vi.fn();
    const nativeThemeSpy = vi.fn((isDarkTheme: boolean) => {
      document.documentElement.dataset.theme = isDarkTheme ? "dark" : "light";
    });
    installZhihuThemeFiber(nativeThemeSpy);
    setNativeThemeReloader(reloadSpy);
    const toolkit = createToolkit();
    toolkit.apply();
    const themeButton = document.getElementById(THEME_BUTTON_ID)!;

    themeButton.click();

    expect(location.search).toBe("?theme=dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(nativeThemeSpy).toHaveBeenCalledWith(true);
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(toolkit.report().themeMode).toBe("dark");

    toolkit.destroy({ silent: true });
    toolkit.apply();
    const darkThemeButton = document.getElementById(THEME_BUTTON_ID)!;

    expect(darkThemeButton.classList.contains(FLOATING_BUTTON_ACTIVE_CLASS)).toBe(true);
    expect(darkThemeButton.getAttribute("title")).toBe("切换到白天模式");
    expect(darkThemeButton.getAttribute("aria-pressed")).toBe("true");

    darkThemeButton.click();

    expect(location.search).toBe("?theme=light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(nativeThemeSpy).toHaveBeenLastCalledWith(false);
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(toolkit.report().themeMode).toBe("light");
  });

  it("falls back to the native theme reload flow when Zhihu's theme provider is unavailable", () => {
    createZhihuFixture();

    const reloadSpy = vi.fn();
    setNativeThemeReloader(reloadSpy);
    const toolkit = createToolkit();
    toolkit.apply();

    document.getElementById(THEME_BUTTON_ID)!.click();

    expect(location.search).toBe("?theme=dark");
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(reloadSpy).toHaveBeenCalledOnce();
    expect(toolkit.report().themeMode).toBe("dark");
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
