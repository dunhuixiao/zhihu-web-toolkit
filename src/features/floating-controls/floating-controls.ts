import {
  BACK_TO_TOP_BUTTON_ID,
  FLOATING_BUTTON_ACTIVE_CLASS,
  FLOATING_CONTROLS_ID,
  NATIVE_BACK_TO_TOP_SELECTORS,
  THEME_BUTTON_ID,
  WORD_BLOCK_BUTTON_ID,
} from "../../shared/constants";
import { toggleWordBlockerPanel } from "../word-blocker/word-blocker";
import { switchNativeThemeWithoutReload } from "./native-theme";

export type ThemeMode = "dark" | "light";

const DARK_THEME_LABEL = "切换到白天模式";
const LIGHT_THEME_LABEL = "切换到暗黑模式";
const WORD_BLOCK_LABEL = "屏蔽词管理";
const BACK_TO_TOP_LABEL = "回到顶部";

const MOON_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5Z"/></svg>`;
const WORD_BLOCK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" alt="${WORD_BLOCK_LABEL}"><path d="M4 5h16l-6.2 7.3V18l-3.6 2v-7.7L4 5Z"/><path d="M7.4 18.1 18.1 7.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const BACK_TO_TOP_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4 5.5 10.5l1.8 1.8 3.4-3.4V20h2.6V8.9l3.4 3.4 1.8-1.8L12 4Z"/></svg>`;

let reloadNativeTheme = (): void => {
  window.location.reload();
};

export function currentThemeMode(): ThemeMode {
  return readThemeModeFromUrl() || readNativeThemeMode();
}

export function isDarkTheme(): boolean {
  return currentThemeMode() === "dark";
}

export function setThemeMode(mode: ThemeMode): void {
  syncThemeUrl(mode);
  if (!switchNativeThemeWithoutReload(mode)) {
    reloadForNativeTheme();
  }
  updateThemeButton(document.getElementById(THEME_BUTTON_ID));
}

export function mountFloatingControls(): HTMLElement {
  removeFloatingControls();

  const controls = document.createElement("div");
  controls.id = FLOATING_CONTROLS_ID;
  controls.setAttribute("aria-label", "知乎网页工具箱");

  const themeButton = createSquareButton(THEME_BUTTON_ID, "");
  themeButton.innerHTML = MOON_ICON;
  themeButton.addEventListener("click", () => {
    setThemeMode(isDarkTheme() ? "light" : "dark");
  });
  updateThemeButton(themeButton);

  const wordBlockButton = createSquareButton(WORD_BLOCK_BUTTON_ID, WORD_BLOCK_LABEL);
  wordBlockButton.innerHTML = WORD_BLOCK_ICON;
  wordBlockButton.addEventListener("click", () => {
    toggleWordBlockerPanel();
  });

  const backToTopButton = createSquareButton(BACK_TO_TOP_BUTTON_ID, BACK_TO_TOP_LABEL);
  backToTopButton.innerHTML = BACK_TO_TOP_ICON;
  backToTopButton.addEventListener("click", () => {
    backToTop();
  });

  controls.append(wordBlockButton, themeButton, backToTopButton);
  document.body.appendChild(controls);

  Array.from(controls.children).forEach((element, index) => {
    if (element instanceof HTMLElement) {
      element.style.animationDelay = `${index * 50}ms`;
    }
  });

  return controls;
}

export function removeFloatingControls(): void {
  document.getElementById(FLOATING_CONTROLS_ID)?.remove();
}

export function setNativeThemeReloader(reloader: () => void): void {
  reloadNativeTheme = reloader;
}

export function resetNativeThemeReloader(): void {
  reloadNativeTheme = () => {
    window.location.reload();
  };
}

export function findNativeBackToTopButton(): HTMLElement | null {
  for (const selector of NATIVE_BACK_TO_TOP_SELECTORS) {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement && !element.closest(`#${FLOATING_CONTROLS_ID}`)) {
      return element;
    }
  }

  return null;
}

export function backToTop(): void {
  const nativeButton = findNativeBackToTopButton();
  if (nativeButton) {
    nativeButton.click();
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
}

function createSquareButton(id: string, label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.id = id;
  button.className = "zhihu-web-toolkit-square-button";
  button.type = "button";
  button.title = label;
  button.setAttribute("aria-label", label);
  if (label) {
    button.setAttribute("alt", label);
  }
  return button;
}

function updateThemeButton(button: Element | null): void {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const dark = isDarkTheme();
  const label = dark ? DARK_THEME_LABEL : LIGHT_THEME_LABEL;

  button.title = label;
  button.setAttribute("aria-label", label);
  button.setAttribute("alt", label);
  button.setAttribute("aria-pressed", String(dark));
  button.classList.toggle(FLOATING_BUTTON_ACTIVE_CLASS, dark);
}

function syncThemeUrl(mode: ThemeMode): void {
  const url = new URL(window.location.href);
  url.searchParams.set("theme", mode);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

function reloadForNativeTheme(): void {
  reloadNativeTheme();
}

function readThemeModeFromUrl(): ThemeMode | null {
  const theme = new URL(window.location.href).searchParams.get("theme");
  return theme === "dark" || theme === "light" ? theme : null;
}

function readNativeThemeMode(): ThemeMode {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
