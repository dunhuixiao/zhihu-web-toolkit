import { createElement, debounce, isVisibleElement } from '../core/dom';
import { ANSWER_SELECTORS, COMMENT_SELECTORS, REPLY_SELECTORS } from '../core/selectors';
import { getStoredValue, setStoredValue } from '../core/storage';
import { renderLucideIcons } from './icons';

export const BLOCKLIST_STORAGE_KEY = 'zhmt:blocklist-settings';

export interface BlocklistSettings {
  keywords: string[];
  targets: {
    feed: boolean;
    answer: boolean;
    comment: boolean;
    reply: boolean;
  };
}

export const DEFAULT_BLOCKLIST_SETTINGS: BlocklistSettings = {
  keywords: [],
  targets: {
    feed: true,
    answer: true,
    comment: true,
    reply: true,
  },
};

const FEED_SELECTORS = [
  '.zhmt-home-feed-item',
  '.TopstoryItem',
  '.Topstory-recommend .Card',
  '.Topstory-mainColumn .Card',
  '#TopstoryContent .ContentItem',
  '.Topstory-mainColumn .ContentItem',
  '.zhmt-modern-home-main .ContentItem',
  '.zhmt-modern-home-main article',
];

const targetSelectors: Record<keyof BlocklistSettings['targets'], string[]> = {
  feed: FEED_SELECTORS,
  answer: ANSWER_SELECTORS,
  comment: COMMENT_SELECTORS,
  reply: REPLY_SELECTORS,
};

let currentSettings = DEFAULT_BLOCKLIST_SETTINGS;
let onSettingsChangedCallback: (() => void) | undefined;

export async function initBlocklist(): Promise<void> {
  currentSettings = await loadBlocklistSettings();
  applyBlocklist();
}

export function onBlocklistSettingsChanged(callback: () => void): void {
  onSettingsChangedCallback = callback;
}

export async function loadBlocklistSettings(): Promise<BlocklistSettings> {
  const saved = await getStoredValue<BlocklistSettings>(BLOCKLIST_STORAGE_KEY, DEFAULT_BLOCKLIST_SETTINGS);

  return normalizeSettings(saved);
}

export async function saveBlocklistSettings(settings: BlocklistSettings): Promise<void> {
  currentSettings = normalizeSettings(settings);
  await setStoredValue(BLOCKLIST_STORAGE_KEY, currentSettings);
  applyBlocklist();
  if (onSettingsChangedCallback) {
    onSettingsChangedCallback();
  }
}

export function getBlocklistSettings(): BlocklistSettings {
  return currentSettings;
}

export function parseKeywordInput(input: string): string[] {
  return input
    .split(/[,，、/\n]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function matchesKeyword(text: string, keywords: string[]): boolean {
  const normalizedText = text.toLocaleLowerCase();

  return keywords.some((keyword) => normalizedText.includes(keyword.toLocaleLowerCase()));
}

export function applyBlocklist(root: ParentNode = document): number {
  const settings = currentSettings;
  const keywords = settings.keywords;

  root.querySelectorAll<HTMLElement>('.zhmt-blocked').forEach((element) => {
    element.classList.remove('zhmt-blocked');
    element.removeAttribute('data-zhmt-blocked');
    element.removeAttribute('aria-hidden');
  });

  if (keywords.length === 0) {
    return 0;
  }

  let blockedCount = 0;

  Object.entries(settings.targets).forEach(([targetName, enabled]) => {
    if (!enabled) {
      return;
    }

    const selectors = targetSelectors[targetName as keyof BlocklistSettings['targets']];
    const matchedElements = new Set<HTMLElement>();
    selectors.forEach((selector) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        if (matchedElements.has(element) || element.closest('.zhmt-blocked, #zh-tools-panel, .zh-copy-md-container, .zhmt-modal')) {
          return;
        }

        if (!isVisibleElement(element)) {
          return;
        }

        if (matchesKeyword(element.textContent || '', keywords)) {
          matchedElements.add(element);
          element.classList.add('zhmt-blocked');
          element.dataset.zhmtBlocked = targetName;
          element.setAttribute('aria-hidden', 'true');
          blockedCount += 1;
        }
      });
    });
  });

  return blockedCount;
}

export function openBlocklistPanel(): void {
  const existing = document.querySelector('.zhmt-modal[data-zhmt-modal="blocklist"]');
  if (existing) {
    existing.remove();
  }

  const modal = createElement('section', {
    className: 'zhmt-modal zh-modal-overlay',
    attrs: {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': '关键词屏蔽设置',
      'data-zhmt-modal': 'blocklist',
    },
  });
  const panel = createElement('div', { className: 'zhmt-modal__panel zh-modal zhmt-blocklist-panel' });
  const header = createElement('header', { className: 'zhmt-modal__header zh-modal-header' });
  const title = createElement('h2', { text: '关键词屏蔽' });
  const close = createElement('button', {
    className: 'zhmt-icon-button zh-modal-close',
    html: '<i data-lucide="x"></i>',
    attrs: { type: 'button', 'aria-label': '关闭' },
  });
  const form = createElement('form', { className: 'zhmt-blocklist-form' });
  const input = createElement('textarea', {
    className: 'zhmt-input zhmt-blocklist-input',
    attrs: {
      placeholder: '输入关键词，可用逗号、斜杠或换行分隔',
      rows: '3',
    },
  });
  const add = createElement('button', {
    className: 'zhmt-button zhmt-button--primary zh-inline-btn',
    text: '新增',
    attrs: { type: 'submit' },
  });
  const targetGroup = createElement('div', { className: 'zhmt-toggle-group' });
  const list = createElement('ul', { className: 'zhmt-keyword-list' });
  const footer = createElement('footer', { className: 'zhmt-modal__footer zh-modal-footer' });

  header.append(title, close);
  form.append(input, add);
  panel.append(header, form, targetGroup, list, footer);
  modal.append(panel);
  document.body.appendChild(modal);

  const render = () => {
    targetGroup.innerHTML = '';
    list.innerHTML = '';
    footer.textContent = `当前共有 ${currentSettings.keywords.length} 个关键词`;

    (Object.keys(currentSettings.targets) as Array<keyof BlocklistSettings['targets']>).forEach((target) => {
      const label = createElement('label', { className: 'zhmt-checkbox' });
      const checkbox = createElement('input', {
        attrs: {
          type: 'checkbox',
          'data-target': target,
        },
      });
      checkbox.checked = currentSettings.targets[target];
      label.append(checkbox, document.createTextNode(targetLabel(target)));
      targetGroup.appendChild(label);
    });

    currentSettings.keywords.forEach((keyword, index) => {
      const item = createElement('li', { className: 'zhmt-keyword-list__item' });
      const text = createElement('span', { text: keyword });
      const actions = createElement('div', { className: 'zhmt-keyword-list__actions' });
      const remove = createElement('button', {
        className: 'zhmt-ghost-button zh-action-btn zhmt-keyword-delete',
        text: '删除',
        attrs: { type: 'button', 'data-index': String(index), 'aria-label': `删除关键词 ${keyword}` },
      });
      actions.appendChild(remove);
      item.append(text, actions);
      list.appendChild(item);
    });
  };

  const showDeleteConfirm = (item: HTMLElement, index: number) => {
    const keyword = currentSettings.keywords[index];
    const actions = item.querySelector<HTMLElement>('.zhmt-keyword-list__actions');
    if (!actions || !keyword) {
      return;
    }

    actions.replaceChildren(
      createElement('button', {
        className: 'zhmt-button zhmt-button--danger zh-action-btn zhmt-keyword-confirm-delete',
        text: '确认删除',
        attrs: { type: 'button', 'data-index': String(index) },
      }),
      createElement('button', {
        className: 'zhmt-ghost-button zh-action-btn zhmt-keyword-cancel-delete',
        text: '手滑了',
        attrs: { type: 'button', 'data-index': String(index) },
      }),
    );
  };

  const closeModal = () => modal.remove();

  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const incoming = parseKeywordInput(input.value);
    const merged = Array.from(new Set([...incoming, ...currentSettings.keywords]));
    await saveBlocklistSettings({ ...currentSettings, keywords: merged });
    input.value = '';
    render();
  });
  targetGroup.addEventListener('change', async (event) => {
    const checkbox = event.target as HTMLInputElement;
    const target = checkbox.dataset.target as keyof BlocklistSettings['targets'] | undefined;
    if (!target) {
      return;
    }

    await saveBlocklistSettings({
      ...currentSettings,
      targets: {
        ...currentSettings.targets,
        [target]: checkbox.checked,
      },
    });
    render();
  });
  list.addEventListener('click', async (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-index]');
    if (!button) {
      return;
    }

    const index = Number(button.dataset.index);
    if (button.classList.contains('zhmt-keyword-delete')) {
      const item = button.closest<HTMLElement>('.zhmt-keyword-list__item');
      if (item) {
        showDeleteConfirm(item, index);
      }
      return;
    }

    if (button.classList.contains('zhmt-keyword-cancel-delete')) {
      render();
      return;
    }

    if (!button.classList.contains('zhmt-keyword-confirm-delete')) {
      return;
    }

    const keywords = currentSettings.keywords.filter((_, keywordIndex) => keywordIndex !== index);
    await saveBlocklistSettings({ ...currentSettings, keywords });
    render();
  });

  render();
  renderLucideIcons(modal);
  input.focus();
}

export const debouncedApplyBlocklist = debounce(() => applyBlocklist(), 300);

function normalizeSettings(settings: BlocklistSettings): BlocklistSettings {
  return {
    keywords: Array.from(new Set((settings.keywords || []).map((keyword) => keyword.trim()).filter(Boolean))),
    targets: {
      feed: settings.targets && settings.targets.feed !== undefined ? settings.targets.feed : true,
      answer: settings.targets && settings.targets.answer !== undefined ? settings.targets.answer : true,
      comment: settings.targets && settings.targets.comment !== undefined ? settings.targets.comment : true,
      reply: settings.targets && settings.targets.reply !== undefined ? settings.targets.reply : true,
    },
  };
}

function targetLabel(target: keyof BlocklistSettings['targets']): string {
  const labels: Record<keyof BlocklistSettings['targets'], string> = {
    feed: '首页推荐',
    answer: '回答',
    comment: '评论',
    reply: '回复',
  };

  return labels[target];
}
