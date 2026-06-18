import { afterEach, describe, expect, it } from 'vitest';
import {
  applyBlocklist,
  DEFAULT_BLOCKLIST_SETTINGS,
  matchesKeyword,
  openBlocklistPanel,
  parseKeywordInput,
  saveBlocklistSettings,
} from '../src/features/blocklist';

describe('blocklist', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
    await saveBlocklistSettings(DEFAULT_BLOCKLIST_SETTINGS);
  });

  it('parses comma slash and newline separated keywords', () => {
    expect(parseKeywordInput('广告,营销/推广\n软文、引流')).toEqual(['广告', '营销', '推广', '软文', '引流']);
  });

  it('matches keywords case-insensitively', () => {
    expect(matchesKeyword('This is a Zhihu answer', ['zhihu'])).toBe(true);
    expect(matchesKeyword('普通回答', ['广告'])).toBe(false);
  });

  it('hides configured answer targets', async () => {
    document.body.innerHTML =
      '<div class="AnswerItem" style="display:block;width:100px;height:100px">这是一条广告回答</div><div class="CommentItem">普通评论</div>';
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: HTMLElement) {
      if (this.classList.contains('AnswerItem')) {
        return {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          top: 0,
          right: 100,
          bottom: 100,
          left: 0,
          toJSON: () => undefined,
        };
      }

      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => undefined,
      };
    });

    await saveBlocklistSettings({
      keywords: ['广告'],
      targets: {
        feed: false,
        answer: true,
        comment: false,
        reply: false,
      },
    });

    expect(applyBlocklist()).toBe(1);
    expect(document.querySelector('.AnswerItem')?.classList.contains('zhmt-blocked')).toBe(true);
    expect(document.querySelector('.CommentItem')?.classList.contains('zhmt-blocked')).toBe(false);
  });

  it('hides matching Zhihu home recommendation feed items', async () => {
    document.documentElement.classList.add('zhmt-page-home');
    document.body.innerHTML = `
      <main class="Topstory">
        <div class="Topstory-mainColumn">
          <div class="Card TopstoryItem" id="blocked-feed">
            <div class="ContentItem">
              <h2 class="ContentItem-title">今日俄罗斯相关讨论</h2>
              <div class="RichContent-inner">推荐摘要</div>
            </div>
          </div>
          <div class="Card TopstoryItem" id="visible-feed">
            <div class="ContentItem">
              <h2 class="ContentItem-title">普通推荐</h2>
            </div>
          </div>
        </div>
      </main>
    `;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: HTMLElement) {
      if (this.classList.contains('TopstoryItem') || this.classList.contains('ContentItem')) {
        return {
          x: 0,
          y: 0,
          width: 694,
          height: 120,
          top: 0,
          right: 694,
          bottom: 120,
          left: 0,
          toJSON: () => undefined,
        };
      }

      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => undefined,
      };
    });

    await saveBlocklistSettings({
      keywords: ['今日俄罗斯'],
      targets: {
        feed: true,
        answer: false,
        comment: false,
        reply: false,
      },
    });

    expect(applyBlocklist()).toBe(1);
    expect(document.querySelector('#blocked-feed')?.classList.contains('zhmt-blocked')).toBe(true);
    expect(document.querySelector('#blocked-feed')?.getAttribute('data-zhmt-blocked')).toBe('feed');
    expect(document.querySelector('#blocked-feed')?.getAttribute('aria-hidden')).toBe('true');
    expect(document.querySelector('#visible-feed')?.classList.contains('zhmt-blocked')).toBe(false);
  });

  it('renders a multiline keyword panel and confirms before deleting keywords', async () => {
    await saveBlocklistSettings({
      keywords: ['广告'],
      targets: {
        feed: true,
        answer: true,
        comment: true,
        reply: true,
      },
    });

    openBlocklistPanel();

    expect(document.querySelector('textarea.zhmt-blocklist-input')).toBeTruthy();
    expect(document.querySelector('.zhmt-keyword-list__item')?.textContent).toContain('广告');

    document.querySelector<HTMLButtonElement>('.zhmt-keyword-delete')?.click();
    expect(document.querySelector('.zhmt-keyword-confirm-delete')?.textContent).toBe('确认删除');
    expect(document.querySelector('.zhmt-keyword-cancel-delete')?.textContent).toBe('手滑了');

    document.querySelector<HTMLButtonElement>('.zhmt-keyword-cancel-delete')?.click();
    expect(document.querySelector('.zhmt-keyword-delete')?.textContent).toBe('删除');

    document.querySelector<HTMLButtonElement>('.zhmt-keyword-delete')?.click();
    document.querySelector<HTMLButtonElement>('.zhmt-keyword-confirm-delete')?.click();
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    expect(document.querySelector('.zhmt-keyword-list__item')).toBeNull();
  });
});
