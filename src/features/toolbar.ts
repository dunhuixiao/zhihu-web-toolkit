import { createElement } from '../core/dom';
import { exportCurrentContentAsPng, saveCurrentContentAsHtml, copyCurrentContentAsMarkdown } from './exportContent';
import { renderLucideIcons } from './icons';
import { openBlocklistPanel } from './blocklist';
import { openProfileModal } from './profile';
import { switchTheme } from './theme';

type ToolbarAction = {
  label: string;
  iconHtml: string;
  onClick: () => void | Promise<void>;
};

const toolbarIcons = {
  wiki:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.75 3A2.75 2.75 0 0 0 2 5.75v11.5A2.75 2.75 0 0 0 4.75 20H11a2 2 0 0 1 2 2 .75.75 0 0 0 1.5 0 2 2 0 0 1 2-2h2.75A2.75 2.75 0 0 0 22 17.25V5.75A2.75 2.75 0 0 0 19.25 3H16.5A3.5 3.5 0 0 0 13 6.5V18a3.48 3.48 0 0 0-2-.63H4.75c-.69 0-1.25-.56-1.25-1.25V5.75c0-.69.56-1.25 1.25-1.25H11a2 2 0 0 1 2 2 .75.75 0 0 0 1.5 0A2 2 0 0 1 16.5 4.5h2.75c.69 0 1.25.56 1.25 1.25v11.5c0 .69-.56 1.25-1.25 1.25H16.5a3.48 3.48 0 0 0-2 .63V6.5A3.5 3.5 0 0 0 11 3H4.75z"/></svg>',
  theme:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.08-.09-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-4 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.5-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4.5 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.5 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>',
  share:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 5.25a3.25 3.25 0 1 1 .92 2.26l-7.24 4.14a3.36 3.36 0 0 1 0 .7l7.24 4.14a3.25 3.25 0 1 1-.75 1.3l-7.24-4.14a3.25 3.25 0 1 1 0-3.3l7.24-4.14a3.24 3.24 0 0 1-.17-.96z"/></svg>',
  save:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.75C5 3.78 5.78 3 6.75 3h10.5C18.22 3 19 3.78 19 4.75v15.38c0 .64-.73 1-1.24.62L12 16.45l-5.76 4.3A.75.75 0 0 1 5 20.13V4.75zm3 3.5A.75.75 0 0 0 8.75 9h6.5a.75.75 0 0 0 0-1.5h-6.5A.75.75 0 0 0 8 8.25zm0 3A.75.75 0 0 0 8.75 12h4.5a.75.75 0 0 0 0-1.5h-4.5A.75.75 0 0 0 8 11.25z"/></svg>',
  filter:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.25A1.25 1.25 0 0 1 5.25 4h13.5a1.25 1.25 0 0 1 .96 2.05L14 12.9v4.85c0 .42-.21.8-.56 1.03l-2 1.33A1.25 1.25 0 0 1 9.5 19.08V12.9L3.54 6.05A1.25 1.25 0 0 1 4 5.25zm1.8.25 5.02 5.78c.12.14.18.31.18.49v5.98l1.5-1v-4.98c0-.18.06-.35.18-.49L17.7 5.5H5.8z"/></svg>',
  settings:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>',
  copy:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  chevron:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>',
} as const;

export function initToolbar(): void {
  const existingToolbar = document.querySelector('#zh-tools-panel');
  const existingMarkdownControl = document.querySelector('.zh-copy-md-container');

  if (existingToolbar?.classList.contains('zhmt-toolbar') && existingMarkdownControl) {
    return;
  }

  if (!existingToolbar?.classList.contains('zhmt-toolbar')) {
    existingToolbar?.remove();
  }
  if (!existingMarkdownControl) {
    document.querySelector('.zhmt-markdown-control')?.remove();
  }
  document.querySelector('#immersive-exit-btn')?.remove();

  if (!existingMarkdownControl) {
    initMarkdownControl();
  }
  if (!existingToolbar?.classList.contains('zhmt-toolbar')) {
    initActionToolbar();
  }
}

function initActionToolbar(): void {
  const toolbar = createElement('div', {
    className: 'zhmt-toolbar',
    attrs: {
      role: 'toolbar',
      'aria-label': '知乎本地阅读工具',
    },
  });
  toolbar.id = 'zh-tools-panel';
  const actions: ToolbarAction[] = [
    {
      label: '个人空间',
      iconHtml: toolbarIcons.wiki,
      onClick: openProfileModal,
    },
    {
      label: '分享 PNG',
      iconHtml: toolbarIcons.share,
      onClick: exportCurrentContentAsPng,
    },
    {
      label: '保存 HTML',
      iconHtml: toolbarIcons.save,
      onClick: saveCurrentContentAsHtml,
    },
    {
      label: '关键词屏蔽',
      iconHtml: toolbarIcons.filter,
      onClick: openBlocklistPanel,
    },
    {
      label: '白天/夜间',
      iconHtml: toolbarIcons.theme,
      onClick: switchTheme,
    },
  ];

  actions.forEach((action, index) => {
    const button = createElement('button', {
      className: 'zhmt-toolbar__button zh-square-btn',
      html: action.iconHtml,
      attrs: {
        type: 'button',
        'aria-label': action.label,
      },
    });
    button.appendChild(
      createElement('span', {
        className: 'zhmt-toolbar__tooltip',
        text: action.label,
        attrs: { 'aria-hidden': 'true' },
      }),
    );
    button.addEventListener('click', () => {
      void action.onClick();
    });
    button.style.animationDelay = `${index * 50}ms`;
    toolbar.appendChild(button);
  });

  document.body.appendChild(toolbar);
  renderLucideIcons(toolbar);
}

function initMarkdownControl(): void {
  const control = createElement('div', {
    className: 'zhmt-markdown-control zh-copy-md-container',
    attrs: { 'aria-label': 'Markdown 操作' },
  });
  const mainButton = createElement('button', {
    className: 'zhmt-markdown-control__main zh-copy-md-btn',
    html: `${toolbarIcons.copy}<span>复制 MD</span>`,
    attrs: {
      type: 'button',
      'aria-label': '复制 Markdown',
      title: '复制 Markdown',
    },
  });
  const menuButton = createElement('button', {
    className: 'zhmt-markdown-control__toggle zh-copy-md-drop',
    html: toolbarIcons.chevron,
    attrs: {
      type: 'button',
      'aria-label': '展开 Markdown 操作',
      title: '展开 Markdown 操作',
      'aria-haspopup': 'menu',
      'aria-expanded': 'false',
    },
  });
  const menu = createElement('div', {
    className: 'zhmt-markdown-control__menu zh-copy-md-menu',
    attrs: { role: 'menu' },
  });
  const menuItem = createElement('button', {
    className: 'zhmt-markdown-control__menu-item zh-copy-md-option',
    text: '复制 Markdown',
    attrs: {
      type: 'button',
      role: 'menuitem',
    },
  });

  const copyMarkdown = () => {
    closeMenu();
    void copyCurrentContentAsMarkdown();
  };
  const openMenu = () => {
    control.classList.add('zhmt-markdown-control--open');
    menu.classList.add('zh-copy-md-menu-show');
    menuButton.setAttribute('aria-expanded', 'true');
  };
  const closeMenu = () => {
    control.classList.remove('zhmt-markdown-control--open');
    menu.classList.remove('zh-copy-md-menu-show');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  const toggleMenu = () => {
    if (control.classList.contains('zhmt-markdown-control--open')) {
      closeMenu();
      return;
    }

    openMenu();
  };

  mainButton.addEventListener('click', copyMarkdown);
  menuItem.addEventListener('click', copyMarkdown);
  menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });
  document.addEventListener('click', (event) => {
    if (!control.contains(event.target as Node)) {
      closeMenu();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  menu.appendChild(menuItem);
  control.append(mainButton, menuButton, menu);
  document.body.appendChild(control);
  renderLucideIcons(control);
}
