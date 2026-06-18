import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyPageCleanup, createHomeFeedAutoLoader, findHomeLoadMoreButton } from '../src/features/layout';

describe('layout', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.className = '';
    window.history.replaceState({}, '', 'https://www.zhihu.com/');
    vi.restoreAllMocks();
  });

  it('marks the home feed and pager controls while preserving the load-more button for automation', () => {
    window.history.replaceState({}, '', 'https://www.zhihu.com/');
    document.body.innerHTML = `
      <main class="Topstory">
        <div class="Topstory-container">
          <div class="Topstory-mainColumn">
            <div class="WriteArea Card">分享此刻的想法... 写回答 发想法</div>
            <button>‹ 上一组</button>
            <button>+ 加载更多</button>
            <article class="TopstoryItem"><div class="ContentItem AnswerItem">推荐内容</div></article>
          </div>
        </div>
      </main>
    `;

    applyPageCleanup();

    expect(document.documentElement.classList.contains('zhmt-page-home')).toBe(true);
    expect(document.querySelector('.Topstory-mainColumn')?.getAttribute('data-zhmt-immersive-wrapper')).toBe('true');
    expect(document.querySelector('.Topstory-mainColumn')?.classList.contains('zh-home-wrapper')).toBe(true);
    expect(document.querySelector('button')?.classList.contains('zhmt-home-pager-control')).toBe(true);
    expect(document.querySelector('.WriteArea')?.classList.contains('zhmt-home-composer')).toBe(true);
    expect(document.querySelector('.WriteArea')?.classList.contains('zhmt-hidden')).toBe(true);
    expect(document.querySelector('.TopstoryItem')?.classList.contains('zhmt-home-feed-item')).toBe(true);
    expect(document.querySelector('.ContentItem')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('.Topstory-container')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('.Topstory-mainColumn')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('.zhmt-home-feed-head')).toBeNull();
    expect(findHomeLoadMoreButton()?.textContent).toContain('加载更多');
    expect(document.querySelector('.zhmt-home-autoload-sentinel')).toBeTruthy();
  });

  it('guards against duplicate home autoload clicks while a load is in progress', () => {
    vi.useFakeTimers();
    window.history.replaceState({}, '', 'https://www.zhihu.com/');
    document.body.innerHTML = `
      <main class="Topstory">
        <div class="Topstory-mainColumn">
          <button id="load-more">+ 加载更多</button>
        </div>
      </main>
    `;
    const button = document.querySelector<HTMLButtonElement>('#load-more')!;
    const clickSpy = vi.spyOn(button, 'click');

    const loader = createHomeFeedAutoLoader();

    expect(loader.loadMore()).toBe(true);
    expect(loader.loadMore()).toBe(false);
    expect(clickSpy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1200);
    expect(loader.loadMore()).toBe(true);
    expect(clickSpy).toHaveBeenCalledTimes(2);

    loader.destroy();
    vi.useRealTimers();
  });

  it('marks question detail pages separately from the home feed', () => {
    window.history.replaceState({}, '', 'https://www.zhihu.com/question/1/answer/2');
    document.body.innerHTML =
      '<header class="QuestionHeader"><div class="QuestionHeader-content"><h1 class="QuestionHeader-title">问题标题</h1><div class="QuestionHeader-detail"><div class="QuestionRichText">问题补充</div></div><footer class="QuestionHeader-footer"></footer></div></header><main class="Question-main"><div class="Question-mainColumn"><div class="AnswerCard"><div class="ContentItem AnswerItem">回答正文</div></div></div></main>';

    applyPageCleanup();

    expect(document.documentElement.classList.contains('zhmt-page-question-detail')).toBe(true);
    expect(document.documentElement.classList.contains('zhmt-page-home')).toBe(false);
    expect(document.querySelector('.zhmt-question-reader-shell')?.getAttribute('data-zhmt-immersive-wrapper')).toBe('true');
    expect(document.querySelector('.zhmt-question-reader-shell')?.classList.contains('zh-question-wrapper')).toBe(true);
    expect(document.querySelector('.Question-main')?.classList.contains('zhmt-readable-shell')).toBe(true);
    expect(document.querySelector('.Question-mainColumn')?.classList.contains('zhmt-readable-main')).toBe(true);
    expect(document.querySelector('.Question-mainColumn')?.getAttribute('data-zhmt-immersive-wrapper')).toBeNull();
    expect(document.querySelector('.QuestionHeader-title')?.classList.contains('zh-question-title')).toBe(true);
    expect(document.querySelector('.QuestionHeader-detail')?.classList.contains('zh-question-detail')).toBe(true);
    expect(document.querySelector('.QuestionHeader-footer')?.classList.contains('zh-question-toolbar')).toBe(true);
    expect(document.querySelector('.AnswerCard')?.classList.contains('zh-question-answer-view')).toBe(true);
    expect(document.querySelector('.AnswerCard')?.classList.contains('zh-question-native-card')).toBe(true);
    expect(document.querySelector('.AnswerItem')?.classList.contains('zh-question-answer-view')).toBe(true);
  });

  it('wraps Zhihu question header blocks and the answer column in one reader shell', () => {
    window.history.replaceState({}, '', 'https://www.zhihu.com/question/1/answer/2');
    document.body.innerHTML =
      '<div class="QuestionPage"><div id="header-block"><div class="QuestionHeader"><div class="QuestionHeader-content"><h1 class="QuestionHeader-title">问题标题</h1></div></div></div><main class="Question-main"><div class="Question-mainColumn"><div class="AnswerCard"><div class="ContentItem AnswerItem">回答正文</div></div></div></main><aside>边栏</aside></div>';

    applyPageCleanup();

    const shell = document.querySelector<HTMLElement>('.zhmt-question-reader-shell');

    expect(shell).toBeTruthy();
    expect(shell?.getAttribute('data-zhmt-immersive-wrapper')).toBe('true');
    expect(shell?.children[0]?.id).toBe('header-block');
    expect(shell?.children[1]?.classList.contains('Question-main')).toBe(true);
    expect(document.querySelector('#header-block')?.parentElement).toBe(shell);
    expect(document.querySelector('.Question-main')?.parentElement).toBe(shell);
  });

  it('does not lock question detail pages to the answer column before the header renders', () => {
    window.history.replaceState({}, '', 'https://www.zhihu.com/question/1/answer/2');
    document.body.innerHTML =
      '<div class="Question-mainColumn"><div class="AnswerCard"><div class="ContentItem AnswerItem">早期回答正文</div></div></div>';

    applyPageCleanup();

    expect(document.documentElement.classList.contains('zhmt-question-shell-pending')).toBe(true);
    expect(document.querySelector('.Question-mainColumn')?.getAttribute('data-zhmt-immersive-wrapper')).toBeNull();
    expect(document.querySelector('.Question-mainColumn')?.id).not.toBe('immersive-wrapper');

    document.body.innerHTML =
      '<div class="QuestionPage"><div id="header-block"><div class="QuestionHeader"><div class="QuestionHeader-content"><h1 class="QuestionHeader-title">问题标题</h1></div></div></div><main class="Question-main"><div class="Question-mainColumn"><div class="AnswerCard"><div class="ContentItem AnswerItem">回答正文</div></div></div></main></div>';

    applyPageCleanup();

    const shell = document.querySelector<HTMLElement>('.zhmt-question-reader-shell');

    expect(document.documentElement.classList.contains('zhmt-question-shell-pending')).toBe(false);
    expect(shell?.id).toBe('immersive-wrapper');
    expect(shell?.getAttribute('data-zhmt-immersive-wrapper')).toBe('true');
    expect(document.querySelector('.Question-mainColumn')?.getAttribute('data-zhmt-immersive-wrapper')).toBeNull();
    expect(document.querySelector('.QuestionHeader')?.parentElement?.parentElement).toBe(shell);
    expect(document.querySelector('.Question-main')?.parentElement).toBe(shell);
  });

  it('marks the modern Zhihu home shell without legacy Topstory classes', () => {
    window.history.replaceState({}, '', 'https://www.zhihu.com/');
    document.body.innerHTML = `
      <div>
        <header>知乎 推荐</header>
        <div id="shell">
          <aside>大家都在搜</aside>
          <main id="feed" style="width:694px;height:600px">
            <section id="composer">分享此刻的想法... 写回答 发想法</section>
            <article>推荐回答</article>
          </main>
          <aside>推荐关注</aside>
        </div>
      </div>
    `;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: HTMLElement) {
      if (this.id === 'feed') {
        return { x: 0, y: 0, width: 694, height: 600, top: 0, right: 694, bottom: 600, left: 0, toJSON: () => undefined };
      }

      if (this.id === 'composer') {
        return { x: 0, y: 0, width: 694, height: 100, top: 0, right: 694, bottom: 100, left: 0, toJSON: () => undefined };
      }

      return { x: 0, y: 0, width: 100, height: 100, top: 0, right: 100, bottom: 100, left: 0, toJSON: () => undefined };
    });

    const feed = document.querySelector<HTMLElement>('#feed');
    applyPageCleanup();

    expect(document.documentElement.classList.contains('zhmt-page-home')).toBe(true);
    expect(feed?.classList.contains('zhmt-modern-home-main')).toBe(true);
    expect(feed?.getAttribute('data-zhmt-immersive-wrapper')).toBe('true');
    expect(feed?.classList.contains('zh-home-wrapper')).toBe(true);
    expect(document.querySelectorAll('.zhmt-home-side-column')).toHaveLength(2);
    expect(document.querySelector('.zhmt-home-composer')?.textContent).toContain('分享此刻');
    expect(document.querySelector('.zhmt-home-composer')?.classList.contains('zhmt-hidden')).toBe(true);
  });

  it('hides text-detected modern home sidebars and marks plain feed cards', () => {
    window.history.replaceState({}, '', 'https://www.zhihu.com/');
    document.body.innerHTML = `
      <div id="page">
        <div id="layout">
          <main id="feed">
            <div id="composer">分享此刻的想法... 提问题 写回答 写文章 发视频</div>
            <div id="item-a">
              <h2><a href="/question/1/answer/2">推荐问题标题</a></h2>
              <div>作者：推荐回答摘要</div>
              <button>阅读全文</button>
              <button>赞同 12</button>
              <button>8 条评论</button>
            </div>
            <div id="item-b">
              <h2><a href="/question/3/answer/4">另一个推荐标题</a></h2>
              <div>回答摘要</div>
              <button>赞同</button>
              <button>分享</button>
            </div>
          </main>
          <aside id="sidebar">大家都在搜 推荐关注 帮助中心 举报中心 关于知乎</aside>
        </div>
      </div>
    `;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: HTMLElement) {
      if (this.id === 'feed') {
        return { x: 0, y: 0, width: 694, height: 720, top: 0, right: 694, bottom: 720, left: 0, toJSON: () => undefined };
      }

      if (this.id === 'item-a' || this.id === 'item-b') {
        return { x: 0, y: 0, width: 694, height: 160, top: 0, right: 694, bottom: 160, left: 0, toJSON: () => undefined };
      }

      if (this.id === 'sidebar') {
        return { x: 720, y: 0, width: 296, height: 600, top: 0, right: 1016, bottom: 600, left: 720, toJSON: () => undefined };
      }

      return { x: 0, y: 0, width: 100, height: 100, top: 0, right: 100, bottom: 100, left: 0, toJSON: () => undefined };
    });

    applyPageCleanup();

    expect(document.querySelector('#feed')?.getAttribute('data-zhmt-immersive-wrapper')).toBe('true');
    expect(document.querySelector('#sidebar')?.classList.contains('zhmt-home-side-column')).toBe(true);
    expect(document.querySelector('#sidebar')?.classList.contains('zhmt-hidden')).toBe(true);
    expect(document.querySelector('#item-a')?.classList.contains('zhmt-home-feed-item')).toBe(true);
    expect(document.querySelector('#item-b')?.classList.contains('zhmt-home-feed-item')).toBe(true);
    expect(document.querySelector('#item-a')?.classList.contains('zh-home-card')).toBe(true);
    expect(document.querySelector('#item-a h2')?.classList.contains('zh-home-card-title')).toBe(true);
  });

  it('does not mark nested Zhihu feed containers as home feed items', () => {
    window.history.replaceState({}, '', 'https://www.zhihu.com/');
    document.body.innerHTML = `
      <div class="Topstory">
        <div class="Topstory-container">
          <div class="Topstory-mainColumn">
            <div class="WriteArea Card">分享此刻的想法... 提问题 写回答 写文章 发视频</div>
            <div class="Topstory-mainColumnCard">
              <div id="TopstoryContent" class="Topstory-content">
                <div class="ListShortcut">
                  <div class="Topstory-recommend">
                    <div class="Card TopstoryItem TopstoryItem-isRecommend">
                      <div class="ContentItem AnswerItem">
                        <h2 class="ContentItem-title"><a href="/question/1/answer/2">推荐标题</a></h2>
                        <div class="RichContent"><div class="RichContent-inner">推荐摘要</div></div>
                        <div class="ContentItem-actions"><button>赞同 12</button><button>3 条评论</button></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    applyPageCleanup();

    expect(document.querySelector('.Topstory-container')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('.Topstory-mainColumn')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('.Topstory-mainColumnCard')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('#TopstoryContent')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('.ListShortcut')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('.Topstory-recommend')?.classList.contains('zhmt-home-feed-item')).toBe(false);
    expect(document.querySelector('.TopstoryItem')?.classList.contains('zhmt-home-feed-item')).toBe(true);
  });
});
