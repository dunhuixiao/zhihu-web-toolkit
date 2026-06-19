import {
  FLOATING_BUTTON_ACTIVE_CLASS,
  FLOATING_CONTROLS_ID,
  THEME_BUTTON_ID,
  WORD_BLOCK_BUTTON_ID,
} from "../../shared/constants";

export type ThemeMode = "dark" | "light";

const DARK_THEME_LABEL = "切换到白天模式";
const LIGHT_THEME_LABEL = "切换到暗黑模式";
const WORD_BLOCK_LABEL = "屏蔽词管理";

const MOON_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5Z"/></svg>`;
const WORD_BLOCK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v10a2.5 2.5 0 0 1-2.5 2.5H9l-5 3V5.5Zm4 2v2h8v-2H8Zm0 4v2h5v-2H8Z"/></svg>`;

export function currentThemeMode(): ThemeMode {
  return isDarkTheme() ? "dark" : "light";
}

export function isDarkTheme(): boolean {
  return document.documentElement.dataset.theme === "dark";
}

export function setThemeMode(mode: ThemeMode): void {
  document.documentElement.dataset.theme = mode;
  syncThemeUrl(mode);
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
    console.info("[zhihu-web-toolkit] Word block manager is not implemented yet.");
  });

  controls.append(themeButton, wordBlockButton);
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

function createSquareButton(id: string, label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.id = id;
  button.className = "zhihu-web-toolkit-square-button";
  button.type = "button";
  button.title = label;
  button.setAttribute("aria-label", label);
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
  button.setAttribute("aria-pressed", String(dark));
  button.classList.toggle(FLOATING_BUTTON_ACTIVE_CLASS, dark);
}

function syncThemeUrl(mode: ThemeMode): void {
  const url = new URL(window.location.href);
  url.searchParams.set("theme", mode);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}
