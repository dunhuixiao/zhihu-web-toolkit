import { FLOATING_BUTTON_ACTIVE_CLASS, WORD_BLOCK_BUTTON_ID } from "../../shared/constants";
import { readText } from "../../shared/dom";
import { loadWordBlockKeywords, parseKeywordInput, saveWordBlockKeywords } from "./storage";

const PANEL_ID = "zhihu-web-toolkit-word-block-panel";
const INPUT_ID = "zhihu-web-toolkit-word-block-input";
const ADD_BUTTON_ID = "zhihu-web-toolkit-word-block-add";
const LIST_ID = "zhihu-web-toolkit-word-block-list";
const CLOSE_BUTTON_ID = "zhihu-web-toolkit-word-block-close";
const COUNT_ID = "zhihu-web-toolkit-word-block-count";
const CONTENT_SELECTOR = ".ContentItem";
const TITLE_SELECTOR = ".ContentItem-title a";
const RECOMMEND_CARD_SELECTOR = ".Card.TopstoryItem.TopstoryItem-isRecommend";
const RESCAN_INTERVAL_MS = 5000;
const SCROLL_DEBOUNCE_MS = 1000;

export interface WordBlockerReport {
  panelFound: boolean;
  keywordCount: number;
  removedCount: number;
}

export interface WordBlockerController {
  destroy: () => void;
  report: () => WordBlockerReport;
  scan: () => void;
  togglePanel: () => void;
}

let activeController: WordBlockerController | null = null;

export function startWordBlocker(): WordBlockerController {
  activeController?.destroy();

  const controller = new WordBlockerControllerImpl();
  activeController = controller;
  controller.start();

  return controller;
}

export function stopWordBlocker(): void {
  activeController?.destroy();
  activeController = null;
}

export function toggleWordBlockerPanel(): void {
  activeController?.togglePanel();
}

export function getWordBlockerReport(): WordBlockerReport {
  return activeController?.report() ?? {
    panelFound: Boolean(document.getElementById(PANEL_ID)),
    keywordCount: loadWordBlockKeywords().length,
    removedCount: 0,
  };
}

class WordBlockerControllerImpl implements WordBlockerController {
  private keywords = loadWordBlockKeywords();
  private observer: MutationObserver | null = null;
  private intervalId: number | null = null;
  private scrollTimeoutId: number | null = null;
  private removedCount = 0;
  private panel: HTMLElement | null = null;
  private documentClickHandler: ((event: MouseEvent) => void) | null = null;
  private scrollHandler: (() => void) | null = null;

  start(): void {
    this.scan();
    this.observeContent();
    this.installScrollRescan();
    this.intervalId = window.setInterval(() => this.scan(), RESCAN_INTERVAL_MS);
  }

  destroy(): void {
    this.observer?.disconnect();
    this.observer = null;

    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.scrollTimeoutId !== null) {
      window.clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
    }

    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      this.scrollHandler = null;
    }

    if (this.documentClickHandler) {
      document.removeEventListener("click", this.documentClickHandler);
      this.documentClickHandler = null;
    }

    this.panel?.remove();
    this.panel = null;
    this.setButtonActive(false);

    if (activeController === this) {
      activeController = null;
    }
  }

  report(): WordBlockerReport {
    return {
      panelFound: Boolean(document.getElementById(PANEL_ID)),
      keywordCount: this.keywords.length,
      removedCount: this.removedCount,
    };
  }

  togglePanel(): void {
    if (!this.panel) {
      this.createPanel();
      this.renderKeywords();
    }

    this.setPanelOpen(this.panel?.dataset.open !== "true");
  }

  scan(): void {
    if (this.keywords.length === 0) {
      return;
    }

    document.querySelectorAll(CONTENT_SELECTOR).forEach((element) => {
      this.processContentElement(element);
    });
  }

  private createPanel(): void {
    document.getElementById(PANEL_ID)?.remove();

    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.setAttribute("aria-label", "屏蔽词管理");
    panel.innerHTML = `
      <div class="zhihu-web-toolkit-word-block-header">
        <div class="zhihu-web-toolkit-word-block-title-row">
          <h3>屏蔽词管理</h3>
          <button id="${CLOSE_BUTTON_ID}" class="zhihu-web-toolkit-word-block-close" type="button" aria-label="关闭屏蔽词管理">×</button>
        </div>
        <div class="zhihu-web-toolkit-word-block-input-row">
          <input id="${INPUT_ID}" class="zhihu-web-toolkit-word-block-input" type="text" placeholder="输入屏蔽词，用 , 或 / 分隔" />
          <button id="${ADD_BUTTON_ID}" class="zhihu-web-toolkit-word-block-add" type="button">新增</button>
        </div>
      </div>
      <ul id="${LIST_ID}" class="zhihu-web-toolkit-word-block-list"></ul>
      <div class="zhihu-web-toolkit-word-block-footer">当前共有 <span id="${COUNT_ID}">0</span> 个屏蔽词</div>
    `;

    document.body.appendChild(panel);
    this.panel = panel;

    this.installPanelEvents(panel);
  }

  private installPanelEvents(panel: HTMLElement): void {
    panel.querySelector<HTMLButtonElement>(`#${CLOSE_BUTTON_ID}`)?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.setPanelOpen(false);
    });

    panel.querySelector<HTMLButtonElement>(`#${ADD_BUTTON_ID}`)?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.addFromInput();
    });

    panel.querySelector<HTMLInputElement>(`#${INPUT_ID}`)?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.addFromInput();
      }
    });

    panel.querySelector<HTMLUListElement>(`#${LIST_ID}`)?.addEventListener("click", (event) => {
      this.handleListClick(event);
    });

    this.documentClickHandler = (event: MouseEvent) => {
      const target = event.target;
      const button = document.getElementById(WORD_BLOCK_BUTTON_ID);

      if (
        target instanceof Node &&
        !panel.contains(target) &&
        (!button || !button.contains(target))
      ) {
        this.setPanelOpen(false);
      }
    };
    document.addEventListener("click", this.documentClickHandler);
  }

  private addFromInput(): void {
    const input = this.panel?.querySelector<HTMLInputElement>(`#${INPUT_ID}`);
    if (!input) {
      return;
    }

    const words = parseKeywordInput(input.value, this.keywords);
    if (words.length === 0) {
      return;
    }

    this.keywords = [...words, ...this.keywords];
    saveWordBlockKeywords(this.keywords);
    input.value = "";
    this.renderKeywords();
    this.scan();
  }

  private handleListClick(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const index = readKeywordIndex(target);
    if (index === null) {
      return;
    }

    event.stopPropagation();

    if (target.classList.contains("zhihu-web-toolkit-word-block-delete")) {
      this.renderDeleteConfirm(index);
      return;
    }

    if (target.classList.contains("zhihu-web-toolkit-word-block-confirm")) {
      this.removeKeyword(index);
      return;
    }

    if (target.classList.contains("zhihu-web-toolkit-word-block-cancel")) {
      this.renderKeywords();
    }
  }

  private removeKeyword(index: number): void {
    if (index < 0 || index >= this.keywords.length) {
      return;
    }

    this.keywords = this.keywords.filter((_, itemIndex) => itemIndex !== index);
    saveWordBlockKeywords(this.keywords);
    this.renderKeywords();
  }

  private renderKeywords(): void {
    const list = this.panel?.querySelector<HTMLUListElement>(`#${LIST_ID}`);
    const count = this.panel?.querySelector<HTMLElement>(`#${COUNT_ID}`);
    if (!list || !count) {
      return;
    }

    list.textContent = "";
    count.textContent = String(this.keywords.length);

    if (this.keywords.length === 0) {
      const empty = document.createElement("li");
      empty.className = "zhihu-web-toolkit-word-block-empty";
      empty.textContent = "暂无屏蔽词";
      list.appendChild(empty);
      return;
    }

    this.keywords.forEach((keyword, index) => {
      list.appendChild(this.createKeywordItem(keyword, index));
    });
  }

  private renderDeleteConfirm(index: number): void {
    const list = this.panel?.querySelector<HTMLUListElement>(`#${LIST_ID}`);
    const keyword = this.keywords[index];
    const item = list?.querySelector<HTMLElement>(`[data-index='${index}']`);
    if (!item || !keyword) {
      return;
    }

    item.textContent = "";
    item.append(createKeywordText(keyword), createConfirmControls(index));
  }

  private createKeywordItem(keyword: string, index: number): HTMLLIElement {
    const item = document.createElement("li");
    const deleteButton = document.createElement("button");

    item.className = "zhihu-web-toolkit-word-block-item";
    item.dataset.index = String(index);
    deleteButton.className = "zhihu-web-toolkit-word-block-delete";
    deleteButton.type = "button";
    deleteButton.dataset.index = String(index);
    deleteButton.textContent = "删除";

    item.append(createKeywordText(keyword), deleteButton);
    return item;
  }

  private processContentElement(element: Element): void {
    const title = readText(element.querySelector(TITLE_SELECTOR)) || readText(element);
    if (!this.keywords.some((keyword) => title.includes(keyword))) {
      return;
    }

    const target = element.closest(RECOMMEND_CARD_SELECTOR) || element;
    if (target.parentElement) {
      target.remove();
      this.removedCount += 1;
    }
  }

  private observeContent(): void {
    if (!document.body) {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => this.processAddedNode(node));
      }
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  private processAddedNode(node: Node): void {
    if (!(node instanceof Element) || this.keywords.length === 0) {
      return;
    }

    if (node.matches(CONTENT_SELECTOR)) {
      this.processContentElement(node);
      return;
    }

    node.querySelectorAll(CONTENT_SELECTOR).forEach((element) => this.processContentElement(element));
  }

  private installScrollRescan(): void {
    this.scrollHandler = () => {
      if (this.scrollTimeoutId !== null) {
        window.clearTimeout(this.scrollTimeoutId);
      }

      this.scrollTimeoutId = window.setTimeout(() => {
        this.scrollTimeoutId = null;
        this.scan();
      }, SCROLL_DEBOUNCE_MS);
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
  }

  private setPanelOpen(open: boolean): void {
    if (!this.panel) {
      return;
    }

    this.panel.dataset.open = String(open);
    this.setButtonActive(open);
    if (open) {
      this.panel.querySelector<HTMLInputElement>(`#${INPUT_ID}`)?.focus();
    }
  }

  private setButtonActive(active: boolean): void {
    document.getElementById(WORD_BLOCK_BUTTON_ID)?.classList.toggle(FLOATING_BUTTON_ACTIVE_CLASS, active);
  }
}

function createKeywordText(keyword: string): HTMLSpanElement {
  const text = document.createElement("span");
  text.className = "zhihu-web-toolkit-word-block-keyword";
  text.textContent = keyword;
  return text;
}

function createConfirmControls(index: number): HTMLDivElement {
  const controls = document.createElement("div");
  const confirm = document.createElement("button");
  const cancel = document.createElement("button");

  controls.className = "zhihu-web-toolkit-word-block-confirm-row";
  confirm.className = "zhihu-web-toolkit-word-block-confirm";
  confirm.type = "button";
  confirm.dataset.index = String(index);
  confirm.textContent = "确认删除";
  cancel.className = "zhihu-web-toolkit-word-block-cancel";
  cancel.type = "button";
  cancel.dataset.index = String(index);
  cancel.textContent = "手滑了";

  controls.append(confirm, cancel);
  return controls;
}

function readKeywordIndex(element: HTMLElement): number | null {
  const value = element.dataset.index || element.closest<HTMLElement>("[data-index]")?.dataset.index;
  if (!value) {
    return null;
  }

  const index = Number(value);
  return Number.isInteger(index) ? index : null;
}
