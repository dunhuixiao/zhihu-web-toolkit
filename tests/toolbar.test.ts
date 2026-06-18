import { afterEach, describe, expect, it, vi } from 'vitest';

const copyMarkdown = vi.fn();

vi.mock('../src/features/exportContent', () => ({
  copyCurrentContentAsMarkdown: copyMarkdown,
  exportCurrentContentAsPng: vi.fn(),
  saveCurrentContentAsHtml: vi.fn(),
}));
vi.mock('../src/features/blocklist', () => ({
  openBlocklistPanel: vi.fn(),
}));
vi.mock('../src/features/profile', () => ({
  openProfileModal: vi.fn(),
}));
vi.mock('../src/features/theme', () => ({
  switchTheme: vi.fn(),
}));

describe('toolbar', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    copyMarkdown.mockClear();
    vi.resetModules();
  });

  it('renders only local non-markdown actions in the right-bottom toolbar', async () => {
    const { initToolbar } = await import('../src/features/toolbar');

    initToolbar();

    const toolbar = document.querySelector('.zhmt-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar?.id).toBe('zh-tools-panel');
    expect(toolbar?.tagName).toBe('DIV');
    expect(toolbar?.getAttribute('role')).toBe('toolbar');
    expect(document.querySelector('.zhmt-markdown-control')).toBeTruthy();
    expect(document.querySelector('.zh-copy-md-container')).toBeTruthy();
    expect(Array.from(toolbar?.querySelectorAll('button') || [])).toHaveLength(5);
    expect(Array.from(toolbar?.querySelectorAll('.zh-square-btn') || [])).toHaveLength(5);
    expect(Array.from(toolbar?.querySelectorAll('.zhmt-toolbar__tooltip') || [])).toHaveLength(5);
    expect(toolbar?.textContent).not.toContain('复制');
    expect(toolbar?.querySelector('[aria-label="复制 Markdown"]')).toBeNull();
    expect(Array.from(toolbar?.querySelectorAll('button') || []).map((button) => button.getAttribute('aria-label'))).toEqual([
      '个人空间',
      '分享 PNG',
      '保存 HTML',
      '关键词屏蔽',
      '白天/夜间',
    ]);
    expect(Array.from(toolbar?.querySelectorAll('.zhmt-toolbar__tooltip') || []).map((tooltip) => tooltip.textContent)).toContain(
      '关键词屏蔽',
    );
    expect(Array.from(toolbar?.querySelectorAll('button[title]') || [])).toHaveLength(0);
  });

  it('copies markdown from the top-right split control', async () => {
    const { initToolbar } = await import('../src/features/toolbar');

    initToolbar();
    expect(document.querySelector('.zhmt-markdown-control__main')?.classList.contains('zh-copy-md-btn')).toBe(true);
    document.querySelector<HTMLButtonElement>('.zhmt-markdown-control__main')?.click();

    expect(copyMarkdown).toHaveBeenCalledTimes(1);
  });

  it('opens the markdown menu and reuses the same copy action', async () => {
    const { initToolbar } = await import('../src/features/toolbar');

    initToolbar();
    document.querySelector<HTMLButtonElement>('.zhmt-markdown-control__toggle')?.click();
    expect(document.querySelector('.zhmt-markdown-control')?.classList.contains('zhmt-markdown-control--open')).toBe(true);
    expect(document.querySelector('.zhmt-markdown-control__menu')?.classList.contains('zh-copy-md-menu-show')).toBe(true);

    document.querySelector<HTMLButtonElement>('.zhmt-markdown-control__menu-item')?.click();

    expect(copyMarkdown).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.zhmt-markdown-control')?.classList.contains('zhmt-markdown-control--open')).toBe(false);
    expect(document.querySelector('.zhmt-markdown-control__menu')?.classList.contains('zh-copy-md-menu-show')).toBe(false);
  });

  it('replaces a reference toolbar with the local-only toolbar', async () => {
    document.body.innerHTML = `
      <div id="zh-tools-panel">
        <button class="zh-square-btn" title="翻译"></button>
        <button class="zh-square-btn" title="阅读笔记"></button>
        <button class="zh-square-btn" title="帮助"></button>
        <button class="zh-square-btn" title="GitHub"></button>
        <button class="zh-square-btn" title="设置"></button>
        <button class="zh-square-btn" title="主题"></button>
        <button class="zh-square-btn" title="零损分享"></button>
        <button class="zh-square-btn" title="个人空间"></button>
      </div>
      <button id="immersive-exit-btn">退出沉浸</button>
    `;
    const { initToolbar } = await import('../src/features/toolbar');

    initToolbar();

    const toolbar = document.querySelector('#zh-tools-panel');
    expect(toolbar?.classList.contains('zhmt-toolbar')).toBe(true);
    expect(toolbar?.querySelectorAll('.zh-square-btn')).toHaveLength(5);
    expect(document.querySelector('#immersive-exit-btn')).toBeNull();
    expect(document.querySelector('.zh-copy-md-container')).toBeTruthy();
  });
});
