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

    expect(document.querySelectorAll(`header[${HEADER_ATTR}='true']`)).toHaveLength(1);
    expect(rebuilt.classList.contains("AppHeader")).toBe(true);
    expect(rebuilt.classList.contains("zhihu-web-toolkit-header")).toBe(true);
    expect(rebuilt.parentElement).toBe(document.body);
    expect(document.body.firstElementChild).toBe(rebuilt);
    expect(document.getElementById("root")?.contains(rebuilt)).toBe(false);
    expect(original.nextElementSibling).toBeNull();
    expect(visibleCount("header.AppHeader:not([data-zhihu-web-toolkit-header='true'])")).toBe(0);
    expect(getComputedStyle(rebuilt).display).not.toBe("none");
  });

  it("rebuilds expected header controls without reparenting native React controls", () => {
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
    expect(rebuiltMessages).not.toBe(nativeMessages);
    expect(rebuiltInbox).not.toBe(nativeInbox);
    expect(rebuiltProfile).not.toBe(nativeProfile);
    expect(rebuilt.querySelector(".css-ruapjk")).not.toBeNull();
    expect(original.querySelector(".SearchBar")).not.toBeNull();
    expect(original.querySelector(".css-ruapjk")).not.toBeNull();
    expect(original.querySelector(".AppHeader-messages")).toBe(nativeMessages);
    expect(original.querySelector(".AppHeader-inbox")).toBe(nativeInbox);
    expect(original.querySelector(".AppHeader-profileEntry")).toBe(nativeProfile);
    expect(report.ruapjkMoved).toBe(true);
    expect(report.missing).toEqual([]);
  });

  it("proxies message and inbox clicks to Zhihu's native popover triggers", () => {
    createZhihuFixture();
    const nativeMessages = document.querySelector<HTMLElement>("#root header.AppHeader .AppHeader-messages")!;
    const nativeInbox = document.querySelector<HTMLElement>("#root header.AppHeader .AppHeader-inbox")!;
    const messagesSpy = vi.fn();
    const inboxSpy = vi.fn();
    const messageRects: DOMRect[] = [];
    const inboxRects: DOMRect[] = [];

    nativeMessages.addEventListener("click", () => {
      messagesSpy();
      messageRects.push(nativeMessages.getBoundingClientRect());
    });
    nativeInbox.addEventListener("click", () => {
      inboxSpy();
      inboxRects.push(nativeInbox.getBoundingClientRect());
    });

    const toolkit = createToolkit();
    toolkit.apply();
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;
    const messages = rebuilt.querySelector<HTMLElement>(`[${MOVED_ITEM_ATTR}='messages']`)!;
    const inbox = rebuilt.querySelector<HTMLElement>(`[${MOVED_ITEM_ATTR}='inbox']`)!;
    const messageRect = new DOMRect(40, 8, 48, 34);
    const inboxRect = new DOMRect(96, 8, 48, 34);
    const messageClick = new MouseEvent("click", { bubbles: true, cancelable: true });
    const inboxClick = new MouseEvent("click", { bubbles: true, cancelable: true });

    vi.spyOn(messages, "getBoundingClientRect").mockReturnValue(messageRect);
    vi.spyOn(inbox, "getBoundingClientRect").mockReturnValue(inboxRect);
    messages.querySelector("span")!.dispatchEvent(messageClick);
    inbox.querySelector("span")!.dispatchEvent(inboxClick);

    expect(messagesSpy).toHaveBeenCalledOnce();
    expect(inboxSpy).toHaveBeenCalledOnce();
    expect(messageRects[0]).toBe(messageRect);
    expect(inboxRects[0]).toBe(inboxRect);
    expect(messageClick.defaultPrevented).toBe(true);
    expect(inboxClick.defaultPrevented).toBe(true);
    expect(document.querySelector("#root header.AppHeader .AppHeader-messages")).toBe(nativeMessages);
    expect(document.querySelector("#root header.AppHeader .AppHeader-inbox")).toBe(nativeInbox);
  });

  it("keeps button-shaped message and inbox controls as native popover proxies", () => {
    createZhihuFixture();
    const nativeMessages = document.querySelector(".AppHeader-messages")!;
    const nativeInbox = document.querySelector(".AppHeader-inbox")!;
    const messagesButton = document.createElement("button");
    const inboxButton = document.createElement("button");
    const messagesSpy = vi.fn();
    const inboxSpy = vi.fn();
    const messageClick = new MouseEvent("click", { bubbles: true, cancelable: true });
    const inboxClick = new MouseEvent("click", { bubbles: true, cancelable: true });

    messagesButton.className = "Button AppHeader-messages";
    messagesButton.type = "button";
    messagesButton.setAttribute("aria-label", "消息");
    messagesButton.textContent = "消息";
    inboxButton.className = "Button AppHeader-inbox";
    inboxButton.type = "button";
    inboxButton.setAttribute("aria-label", "私信");
    inboxButton.textContent = "私信";
    messagesButton.addEventListener("click", messagesSpy);
    inboxButton.addEventListener("click", inboxSpy);
    nativeMessages.replaceWith(messagesButton);
    nativeInbox.replaceWith(inboxButton);

    const toolkit = createToolkit();
    toolkit.apply();
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;
    const messages = rebuilt.querySelector<HTMLElement>(`[${MOVED_ITEM_ATTR}='messages']`)!;
    const inbox = rebuilt.querySelector<HTMLElement>(`[${MOVED_ITEM_ATTR}='inbox']`)!;

    messages.dispatchEvent(messageClick);
    inbox.dispatchEvent(inboxClick);

    expect(messages.tagName).toBe("BUTTON");
    expect(inbox.tagName).toBe("BUTTON");
    expect(messageClick.defaultPrevented).toBe(true);
    expect(inboxClick.defaultPrevented).toBe(true);
    expect(messagesSpy).toHaveBeenCalledOnce();
    expect(inboxSpy).toHaveBeenCalledOnce();
  });

  it("resolves the current native popover trigger when Zhihu replaces header controls", () => {
    createZhihuFixture();
    const nativeMessages = document.querySelector(".AppHeader-messages")!;
    const currentMessages = nativeMessages.cloneNode(true) as HTMLElement;
    const staleSpy = vi.fn();
    const currentSpy = vi.fn();

    nativeMessages.addEventListener("click", staleSpy);

    const toolkit = createToolkit();
    toolkit.apply();
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;
    const messages = rebuilt.querySelector<HTMLElement>(`[${MOVED_ITEM_ATTR}='messages']`)!;
    const proxyRect = new DOMRect(40, 8, 48, 34);
    const currentRects: DOMRect[] = [];

    currentMessages.addEventListener("click", () => {
      currentSpy();
      currentRects.push(currentMessages.getBoundingClientRect());
    });
    nativeMessages.replaceWith(currentMessages);
    vi.spyOn(messages, "getBoundingClientRect").mockReturnValue(proxyRect);

    messages.click();

    expect(staleSpy).not.toHaveBeenCalled();
    expect(currentSpy).toHaveBeenCalledOnce();
    expect(currentRects[0]).toBe(proxyRect);
  });

  it("keeps rebuilt header controls interactive through proxies", () => {
    createZhihuFixture();

    const searchSpy = vi.fn((event: Event) => event.preventDefault());
    const inputSpy = vi.fn();
    const profileSpy = vi.fn();

    const nativeSearch = document.querySelector<HTMLFormElement>(".SearchBar")!;
    nativeSearch.addEventListener("submit", searchSpy);
    nativeSearch.querySelector("input")!.addEventListener("input", inputSpy);
    const nativeMessages = document.querySelector<HTMLElement>("#root header.AppHeader .AppHeader-messages")!;
    const nativeInbox = document.querySelector<HTMLElement>("#root header.AppHeader .AppHeader-inbox")!;
    const nativeProfile = document.querySelector<HTMLButtonElement>("#root header.AppHeader .AppHeader-profile")!;
    nativeProfile.addEventListener("click", profileSpy);

    const toolkit = createToolkit();
    toolkit.apply();
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;
    const proxySearch = rebuilt.querySelector<HTMLFormElement>(".SearchBar")!;

    proxySearch.querySelector("input")!.value = "测试搜索";
    proxySearch.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    rebuilt.querySelector<HTMLElement>("[data-zhihu-web-toolkit-item='profile']")!.click();

    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .SearchBar"),
    ).toBe(nativeSearch);
    expect(nativeSearch.querySelector("input")!.value).toBe("测试搜索");
    expect(searchSpy).toHaveBeenCalledOnce();
    expect(inputSpy).toHaveBeenCalledOnce();
    expect(rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='messages']`)).not.toBe(nativeMessages);
    expect(rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='inbox']`)).not.toBe(nativeInbox);
    expect(rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='profile']`)).not.toBe(nativeProfile);
    expect(document.querySelector("#root header.AppHeader .AppHeader-messages")).toBe(nativeMessages);
    expect(document.querySelector("#root header.AppHeader .AppHeader-inbox")).toBe(nativeInbox);
    expect(document.querySelector("#root header.AppHeader .AppHeader-profile")).toBe(nativeProfile);
    expect(profileSpy).toHaveBeenCalledOnce();
  });

  it("uses the real profile entry instead of Zhihu's hidden creator hint popover", () => {
    createZhihuFixture();
    const originalProfile = document.querySelector(".AppHeader-profile")!;
    const avatarSrc = "https://picx.zhimg.com/real-profile-avatar.jpg";
    originalProfile.insertAdjacentHTML(
      "beforebegin",
      `<div class="Popover AppHeaderProfileMenu-creatorHintPopover" aria-label="个人信息" title="个人信息" style="position: absolute; z-index: -1;">
        <div class="AppHeaderProfileMenu-creatorHintToggler"></div>
      </div>
      <button class="Button AppHeader-profileEntry" type="button">
        <img class="Avatar AppHeader-profileAvatar" src="${avatarSrc}" srcset="https://picx.zhimg.com/stale-avatar.jpg 2x" alt="点击打开真实用户的主页" />
      </button>`,
    );
    originalProfile.remove();

    const profileSpy = vi.fn();
    const profileRects: DOMRect[] = [];
    const nativeProfile = document.querySelector<HTMLButtonElement>("#root header.AppHeader .AppHeader-profileEntry")!;
    nativeProfile.addEventListener("click", () => {
      profileSpy();
      profileRects.push(nativeProfile.getBoundingClientRect());
    });

    const toolkit = createToolkit();
    toolkit.apply();
    const rebuiltProfile = document.querySelector<HTMLElement>(
      `header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='profile']`,
    )!;
    const proxyRect = new DOMRect(88, 12, 32, 32);
    vi.spyOn(rebuiltProfile, "getBoundingClientRect").mockReturnValue(proxyRect);

    expect(rebuiltProfile).not.toBe(nativeProfile);
    expect(
      document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .AppHeader-profileEntry"),
    ).toBe(nativeProfile);
    expect(rebuiltProfile.tagName).toBe("BUTTON");
    expect(rebuiltProfile.classList.contains("AppHeader-profileEntry")).toBe(true);
    expect(rebuiltProfile.classList.contains("AppHeaderProfileMenu-creatorHintPopover")).toBe(false);
    expect(rebuiltProfile.querySelector<HTMLImageElement>("img")?.src).toBe(avatarSrc);
    expect(rebuiltProfile.querySelector<HTMLImageElement>("img")?.getAttribute("srcset")).toBeNull();
    expect(rebuiltProfile.querySelector<HTMLImageElement>("img")?.alt).toBe("点击打开真实用户的主页");

    rebuiltProfile.click();

    expect(profileSpy).toHaveBeenCalledOnce();
    expect(profileRects[0]).toBe(proxyRect);
  });

  it("keeps the cloned profile avatar synced when Zhihu updates the native image later", async () => {
    createZhihuFixture();

    const toolkit = createToolkit();
    toolkit.apply();
    const nativeImage = document.querySelector<HTMLImageElement>(
      "#root header.AppHeader:not([data-zhihu-web-toolkit-header='true']) .AppHeader-profileEntry img",
    )!;
    const proxyImage = document.querySelector<HTMLImageElement>(
      `header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='profile'] img`,
    )!;
    const updatedSrc = "https://picx.zhimg.com/final-profile-avatar.jpg";

    nativeImage.setAttribute("src", updatedSrc);
    nativeImage.setAttribute("srcset", "https://picx.zhimg.com/final-profile-avatar@2x.jpg 2x");
    nativeImage.setAttribute("alt", "点击打开最终用户的主页");

    await vi.waitFor(() => expect(proxyImage.src).toBe(updatedSrc));

    expect(proxyImage.getAttribute("src")).toBe(updatedSrc);
    expect(proxyImage.getAttribute("srcset")).toBeNull();
    expect(proxyImage.alt).toBe("点击打开最终用户的主页");
  });

  it("does not duplicate the profile avatar when css-ruapjk already contains Zhihu's profile menu", () => {
    createZhihuFixture();
    const ruapjk = document.querySelector(".css-ruapjk")!;

    ruapjk.innerHTML = `
      <div class="Popover AppHeader-profileMenu">
        <button class="Button AppHeader-profileEntry AppHeader-profile" type="button">
          <img class="Avatar AppHeader-profileAvatar" src="https://picx.zhimg.com/ruapjk-avatar.jpg" alt="点击打开用户的主页" />
        </button>
      </div>
    `;

    const toolkit = createToolkit();
    toolkit.apply();
    const rebuilt = document.querySelector(`header[${HEADER_ATTR}='true']`)!;

    expect(rebuilt.querySelectorAll(".AppHeader-profileEntry")).toHaveLength(1);
    expect(rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='profile']`)).not.toBeNull();
    expect(rebuilt.querySelector(`[${MOVED_ITEM_ATTR}='ruapjk']`)).toBeNull();
    expect(toolkit.report().ruapjkMoved).toBe(false);
  });

  it("is idempotent when apply is called repeatedly", () => {
    createZhihuFixture();

    const nativeProfile = document.querySelector<HTMLElement>("#root header.AppHeader .AppHeader-profileEntry")!;
    const originalProfileGetBoundingClientRect = nativeProfile.getBoundingClientRect;
    const toolkit = createToolkit();
    toolkit.apply();
    toolkit.apply();

    expect(document.querySelectorAll(`header[${HEADER_ATTR}='true']`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${STYLE_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${FLOATING_CONTROLS_ID}`)).toHaveLength(1);

    toolkit.destroy({ silent: true });

    expect(nativeProfile.getBoundingClientRect).toBe(originalProfileGetBoundingClientRect);
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

  it("destroy removes injected artifacts without disturbing native header nodes", () => {
    createZhihuFixture();

    const originalHeader = document.querySelector("#root header.AppHeader:not([data-zhihu-web-toolkit-header='true'])")!;
    const nativeMessages = document.querySelector("#root header.AppHeader .AppHeader-messages")!;
    const nativeInbox = document.querySelector("#root header.AppHeader .AppHeader-inbox")!;
    const nativeProfile = document.querySelector("#root header.AppHeader .AppHeader-profileEntry")!;
    const originalProfileGetBoundingClientRect = nativeProfile.getBoundingClientRect;
    const toolkit = createToolkit();
    toolkit.apply();

    expect(document.querySelector(`header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='messages']`)).not.toBe(nativeMessages);
    expect(document.querySelector(`header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='inbox']`)).not.toBe(nativeInbox);
    expect(document.querySelector(`header[${HEADER_ATTR}='true'] [${MOVED_ITEM_ATTR}='profile']`)).not.toBe(nativeProfile);
    expect(originalHeader.querySelector(".AppHeader-messages")).toBe(nativeMessages);
    expect(originalHeader.querySelector(".AppHeader-inbox")).toBe(nativeInbox);
    expect(originalHeader.querySelector(".AppHeader-profileEntry")).toBe(nativeProfile);

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
    expect(nativeProfile.getBoundingClientRect).toBe(originalProfileGetBoundingClientRect);
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
