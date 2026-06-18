import { createElement, escapeHtml, removeElements } from '../core/dom';
import { requestText } from '../core/http';
import { PROFILE_CONTENT_SELECTORS, PROFILE_NOISE_SELECTORS } from '../core/selectors';
import { renderLucideIcons } from './icons';
import { showToast } from './toast';

export async function openProfileModal(): Promise<void> {
  const existing = document.querySelector('.zhmt-modal[data-zhmt-modal="profile"]');
  if (existing) {
    existing.remove();
  }

  const modal = createProfileShell();
  document.body.appendChild(modal.root);
  renderLucideIcons(modal.root);

  const profileUrl = findCurrentProfileUrl();

  if (!profileUrl) {
    modal.body.innerHTML = '<p>未识别到当前登录用户主页。</p><p>可以从知乎头像菜单进入个人主页后再打开此面板。</p>';
    return;
  }

  modal.body.innerHTML = '<p>正在加载个人空间...</p>';

  try {
    const html = await requestText(profileUrl);
    modal.body.innerHTML = extractProfileHtml(html, profileUrl);
  } catch (error) {
    console.error('[zhmt] profile request failed', error);
    modal.body.innerHTML = `<p>个人空间加载失败。</p><p><a href="${escapeHtml(profileUrl)}" target="_blank" rel="noreferrer">打开原主页</a></p>`;
    showToast('个人空间加载失败');
  }
}

export function findCurrentProfileUrl(root: ParentNode = document): string | undefined {
  const candidates = [
    '[aria-label*="我的主页"]',
    '.AppHeader-profile a[href*="/people/"]',
    '.AppHeader-profile a[href*="/org/"]',
    'a[href^="/people/"]',
    'a[href^="/org/"]',
    'a[href*="www.zhihu.com/people/"]',
    'a[href*="www.zhihu.com/org/"]',
  ];

  for (const selector of candidates) {
    const anchor = root.querySelector<HTMLAnchorElement>(selector);
    const href = anchor ? anchor.href || anchor.getAttribute('href') : undefined;
    if (href) {
      return new URL(href, window.location.origin).href;
    }
  }

  return undefined;
}

function createProfileShell() {
  const root = createElement('section', {
    className: 'zhmt-modal zh-modal-overlay',
    attrs: {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': '个人空间',
      'data-zhmt-modal': 'profile',
    },
  });
  const panel = createElement('div', { className: 'zhmt-modal__panel zh-modal zhmt-profile-panel' });
  const header = createElement('header', { className: 'zhmt-modal__header zh-modal-header' });
  const title = createElement('h2', { text: '个人空间' });
  const close = createElement('button', {
    className: 'zhmt-icon-button zh-modal-close',
    html: '<i data-lucide="x"></i>',
    attrs: { type: 'button', 'aria-label': '关闭' },
  });
  const body = createElement('div', { className: 'zhmt-modal__body zh-modal-body' });

  header.append(title, close);
  panel.append(header, body);
  root.append(panel);

  close.addEventListener('click', () => root.remove());
  root.addEventListener('click', (event) => {
    if (event.target === root) {
      root.remove();
    }
  });

  return { root, body };
}

function extractProfileHtml(html: string, profileUrl: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  removeElements(PROFILE_NOISE_SELECTORS, doc);

  const fragments = PROFILE_CONTENT_SELECTORS.flatMap((selector) => Array.from(doc.querySelectorAll<HTMLElement>(selector)));
  const uniqueFragments = Array.from(new Set(fragments)).slice(0, 8);

  if (uniqueFragments.length === 0) {
    return `<p>未能解析个人空间内容。</p><p><a href="${escapeHtml(profileUrl)}" target="_blank" rel="noreferrer">打开原主页</a></p>`;
  }

  uniqueFragments.forEach((fragment) => {
    removeElements(PROFILE_NOISE_SELECTORS, fragment);
    fragment.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (href) {
        anchor.setAttribute('href', new URL(href, profileUrl).href);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noreferrer');
      }
    });
  });

  return `${uniqueFragments.map((fragment) => fragment.outerHTML).join('')}<p class="zhmt-profile-link"><a href="${escapeHtml(
    profileUrl,
  )}" target="_blank" rel="noreferrer">打开原主页</a></p>`;
}
