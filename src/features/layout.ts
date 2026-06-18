import { hideElementsBySelectors } from '../core/dom';
import { AD_SELECTORS, NOISE_SELECTORS } from '../core/selectors';

const PAGE_CLASS_NAMES = ['zhmt-page-home', 'zhmt-page-question-detail', 'zhmt-page-post'] as const;
const HOME_LOAD_MORE_SELECTORS = [
  '.Topstory button',
  '.Topstory-mainColumn button',
  '.Topstory-container button',
  'button',
];
const HOME_SIDEBAR_TEXT = /大家都在搜|推荐关注|帮助中心|举报中心|关于知乎|付费咨询|知乎知学堂|盐言作者平台|边栏锚点|服务热线|网站资质信息/;
const HOME_COMPOSER_TEXT = /分享此刻的想法|提问题|写回答|写文章|发视频|同步到圈子/;
const HOME_FEED_TEXT = /阅读全文|赞同|条评论|收藏|喜欢|分享/;
const HOME_FEED_CONTAINER_SELECTOR =
  '.Topstory, .Topstory-container, .Topstory-mainColumn, .Topstory-mainColumnCard, #TopstoryContent, .ListShortcut, .Topstory-recommend, .zhmt-modern-home-main, [data-zhmt-immersive-wrapper="true"].zh-home-wrapper';

let homeAutoLoader: HomeFeedAutoLoader | undefined;

export function applyPageCleanup(root: ParentNode = document): void {
  markReadableShell();
  hideElementsBySelectors(NOISE_SELECTORS, root);
  hideElementsBySelectors(AD_SELECTORS, root);
  setupHomeFeedAutoLoad();
}

function markReadableShell(): void {
  document.documentElement.classList.add('zhmt-enabled');
  markPageKind();
  markModernHomeShell();
  markReferenceImmersiveShell();
  markHomeFeedItems();
  markHomeFeedControls();
  markQuestionReaderClasses();

  document.querySelectorAll<HTMLElement>('.Topstory, .Question-main, .Post-main, .Post-Row-Content').forEach((element) => {
    element.classList.add('zhmt-readable-shell');
  });

  document
    .querySelectorAll<HTMLElement>('.Topstory-mainColumn, .Question-mainColumn, .Post-Row-Content-left, .Post-content')
    .forEach((element) => {
      element.classList.add('zhmt-readable-main');
    });
}

function markReferenceImmersiveShell(): void {
  document.querySelectorAll<HTMLElement>('.zhmt-immersive-wrapper').forEach((element) => {
    element.classList.remove('zhmt-immersive-wrapper', 'zh-home-wrapper', 'zh-home-wide', 'zh-question-wrapper');
    element.removeAttribute('data-zhmt-immersive-wrapper');
    if (element.id === 'immersive-wrapper') {
      element.removeAttribute('id');
    }
  });

  if (document.documentElement.classList.contains('zhmt-page-home')) {
    const homeMain = document.querySelector<HTMLElement>('.zhmt-modern-home-main, .Topstory-mainColumn');
    markImmersiveElement(homeMain, ['zh-home-wrapper', 'zh-home-wide']);
    return;
  }

  if (document.documentElement.classList.contains('zhmt-page-question-detail')) {
    const questionShell = ensureQuestionReaderShell();
    if (questionShell) {
      markImmersiveElement(questionShell, ['zh-question-wrapper']);
      return;
    }

    document.documentElement.classList.add('zhmt-question-shell-pending');
  }
}

function ensureQuestionReaderShell(): HTMLElement | null {
  const header = document.querySelector<HTMLElement>('.QuestionHeader');
  const main = document.querySelector<HTMLElement>('.Question-main');
  if (!header && !main) {
    return null;
  }

  const sharedParent = header && main ? findSharedQuestionParent(header, main) : undefined;
  if (sharedParent) {
    sharedParent.classList.add('zhmt-question-reader-shell');
    document.documentElement.classList.remove('zhmt-question-shell-pending');
    return sharedParent;
  }

  let shell = document.querySelector<HTMLElement>('.zhmt-question-reader-shell');
  const headerBlock = header && main ? findQuestionHeaderBlock(header, main) : header;
  const anchor = headerBlock || main;
  const shellParent = anchor?.parentElement;

  if (!shell) {
    shell = document.createElement('main');
    shell.className = 'zhmt-question-reader-shell';
    shellParent?.insertBefore(shell, anchor);
  }

  if (headerBlock && headerBlock.parentElement !== shell) {
    shell.appendChild(headerBlock);
  }
  if (main && main.parentElement !== shell) {
    shell.appendChild(main);
  }

  document.documentElement.classList.remove('zhmt-question-shell-pending');
  return shell;
}

function findQuestionHeaderBlock(header: HTMLElement, main: HTMLElement): HTMLElement {
  const headerParent = header.parentElement;
  if (!headerParent || headerParent === document.body || headerParent === document.documentElement) {
    return header;
  }

  if (headerParent.parentElement !== main.parentElement) {
    return header;
  }

  const meaningfulChildren = Array.from(headerParent.children).filter((child) => {
    if (!(child instanceof HTMLElement)) {
      return false;
    }

    const text = (child.textContent || '').trim();
    return text.length > 0 && child.getBoundingClientRect().height > 0;
  });

  return meaningfulChildren.length <= 1 ? headerParent : header;
}

function findSharedQuestionParent(header: HTMLElement, main: HTMLElement): HTMLElement | undefined {
  const parent = header.parentElement;
  if (!parent || parent !== main.parentElement || parent === document.body || parent === document.documentElement) {
    return undefined;
  }

  const meaningfulChildren = Array.from(parent.children).filter((child) => {
    if (!(child instanceof HTMLElement)) {
      return false;
    }

    if (child === header || child === main) {
      return true;
    }

    const text = (child.textContent || '').trim();
    return text.length > 0 && child.getBoundingClientRect().height > 0;
  });

  if (meaningfulChildren.length > 4) {
    return undefined;
  }

  return parent;
}

function markImmersiveElement(element: HTMLElement | null, classNames: string[]): void {
  if (!element) {
    return;
  }

  const existing = document.getElementById('immersive-wrapper');
  if (existing && existing !== element) {
    existing.removeAttribute('id');
  }

  if (!element.id) {
    element.id = 'immersive-wrapper';
  }
  element.setAttribute('data-zhmt-immersive-wrapper', 'true');
  element.classList.add('zhmt-immersive-wrapper', ...classNames);
}

function markModernHomeShell(): void {
  if (!document.documentElement.classList.contains('zhmt-page-home')) {
    return;
  }

  const pageRoot = document.body.querySelector<HTMLElement>('body > div > div, body > div main, main') || document.body;
  const composer = findElementByText('分享此刻的想法');
  const feedMain = document.querySelector<HTMLElement>('.Topstory-mainColumn') || findHomeFeedMain(composer);

  if (feedMain) {
    feedMain.classList.add('zhmt-modern-home-main', 'zhmt-readable-main');
    markHomeShellAndSidebars(feedMain);
  }

  markHomeSidebarByText();
  markHomeComposer(composer, pageRoot);
}

function markPageKind(): void {
  document.documentElement.classList.remove(...PAGE_CLASS_NAMES);

  if (isHomeRecommendPage()) {
    document.documentElement.classList.add('zhmt-page-home');
    return;
  }

  if (isQuestionDetailPage()) {
    document.documentElement.classList.add('zhmt-page-question-detail');
    return;
  }

  if (isPostPage()) {
    document.documentElement.classList.add('zhmt-page-post');
  }
}

export function isHomeRecommendPage(url: Location | URL = window.location): boolean {
  return url.hostname.endsWith('zhihu.com') && (url.pathname === '/' || url.pathname === '');
}

export function isQuestionDetailPage(url: Location | URL = window.location): boolean {
  return url.hostname.endsWith('zhihu.com') && /^\/question\/\d+/.test(url.pathname);
}

export function isPostPage(url: Location | URL = window.location): boolean {
  return url.hostname === 'zhuanlan.zhihu.com' || /^\/p\//.test(url.pathname);
}

function setupHomeFeedAutoLoad(): void {
  if (!isHomeRecommendPage()) {
    if (homeAutoLoader) {
      homeAutoLoader.destroy();
      homeAutoLoader = undefined;
    }
    return;
  }

  if (!homeAutoLoader) {
    homeAutoLoader = createHomeFeedAutoLoader();
    return;
  }

  homeAutoLoader.refresh();
}

function markHomeFeedControls(): void {
  if (!document.documentElement.classList.contains('zhmt-page-home')) {
    return;
  }

  document
    .querySelectorAll<HTMLButtonElement>('.Topstory button, .Topstory-mainColumn button, .Topstory-container button, .zhmt-modern-home-main button')
    .forEach((button) => {
      const text = (button.textContent || '').replace(/\s+/g, '');

      if (text.includes('加载更多')) {
        button.classList.add('zhmt-home-load-more');
        return;
      }

      if (text.includes('上一组') || text.includes('下一组') || text.includes('上一页') || text.includes('下一页')) {
        button.classList.add('zhmt-home-pager-control');
      }
    });
}

function markHomeFeedItems(): void {
  if (!document.documentElement.classList.contains('zhmt-page-home')) {
    return;
  }

  document.querySelectorAll<HTMLElement>('.zhmt-home-feed-item').forEach((element) => {
    element.classList.remove('zhmt-home-feed-item', 'zh-home-card');
    element
      .querySelectorAll<HTMLElement>('.zh-home-card-title, .zh-home-card-meta, .zh-home-card-snippet, .zh-home-card-type')
      .forEach((child) => child.classList.remove('zh-home-card-title', 'zh-home-card-meta', 'zh-home-card-snippet', 'zh-home-card-type'));
  });

  document
    .querySelectorAll<HTMLElement>(
      '.Topstory-mainColumn .TopstoryItem, .zhmt-modern-home-main .TopstoryItem, #TopstoryContent .TopstoryItem, .zhmt-modern-home-main > article, [data-zhmt-immersive-wrapper="true"].zh-home-wrapper > article',
    )
    .forEach((element) => {
      if (!element.classList.contains('zhmt-home-composer') && !element.closest('.zhmt-home-composer')) {
        markHomeFeedItem(element);
      }
    });

  document.querySelectorAll<HTMLElement>('[data-zhmt-immersive-wrapper="true"].zh-home-wrapper > .Card').forEach((element) => {
    if (!element.classList.contains('WriteArea') && !element.classList.contains('zhmt-home-composer')) {
      markHomeFeedItem(element);
    }
  });

  findModernHomeFeedItems().forEach((element) => {
    markHomeFeedItem(element);
  });
}

function markHomeFeedItem(element: HTMLElement): void {
  element.classList.add('zhmt-home-feed-item', 'zh-home-card');

  const title = element.querySelector<HTMLElement>(
    '.ContentItem-title, .ContentItem-title a, h2, h2 a, a[href*="/question/"], a[href*="/answer/"], a[href*="/p/"]',
  );
  title?.classList.add('zh-home-card-title');

  const author = element.querySelector<HTMLElement>('.AuthorInfo, .ContentItem-meta, .ContentItem-author, [class*="AuthorInfo"]');
  author?.classList.add('zh-home-card-meta');

  const snippet = element.querySelector<HTMLElement>('.RichContent-inner, .RichText, .ContentItem-excerpt, .RichContent, .ContentItem-time + div');
  snippet?.classList.add('zh-home-card-snippet');

  const badgeSource = element.querySelector<HTMLElement>('.ContentItem-status, .ContentItem-type, [class*="ContentItem-status"]');
  badgeSource?.classList.add('zh-home-card-type');
}

function markQuestionReaderClasses(): void {
  if (!document.documentElement.classList.contains('zhmt-page-question-detail')) {
    return;
  }

  const questionHeader = document.querySelector<HTMLElement>('.QuestionHeader');
  questionHeader?.classList.add('zhmt-question-native-header');

  const title = document.querySelector<HTMLElement>('.QuestionHeader-title');
  title?.classList.add('zh-question-title');

  const detail = document.querySelector<HTMLElement>('.QuestionRichText');
  detail?.classList.add('zh-question-detail-body');

  const detailContainer = detail?.closest<HTMLElement>('.QuestionHeader-detail') || detail?.parentElement;
  detailContainer?.classList.add('zh-question-detail');

  document.querySelector<HTMLElement>('.QuestionHeader-footer')?.classList.add('zh-question-toolbar');

  document
    .querySelectorAll<HTMLElement>('.Question-mainColumn .AnswerCard, .Question-mainColumn .List-item, .QuestionAnswer-content, .AnswerItem')
    .forEach((element) => {
      element.classList.add('zh-question-answer-view');
    });

  document.querySelectorAll<HTMLElement>('.Question-mainColumn .Card, .Question-mainColumn .List, .Question-mainColumn .AnswerCard').forEach((element) => {
    element.classList.add('zh-question-native-card');
  });
}

export interface HomeFeedAutoLoader {
  sentinel: HTMLElement;
  refresh: () => void;
  destroy: () => void;
  loadMore: () => boolean;
}

export function createHomeFeedAutoLoader(root: ParentNode = document): HomeFeedAutoLoader {
  const sentinel = ensureHomeFeedSentinel(root);
  let loading = false;
  let releaseTimer: number | undefined;

  const release = () => {
    loading = false;
    releaseTimer = undefined;
  };
  const loadMore = () => {
    if (loading) {
      return false;
    }

    const button = findHomeLoadMoreButton(root);
    if (!button) {
      return false;
    }

    loading = true;
    button.click();
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(release, 1200);
    return true;
  };
  const refresh = () => {
    const mainColumn = findHomeFeedContainer(root);
    if (mainColumn && sentinel.parentElement !== mainColumn) {
      mainColumn.appendChild(sentinel);
    }
  };
  const observer =
    typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              loadMore();
            }
          },
          { rootMargin: '720px 0px' },
        )
      : undefined;
  const onScroll = () => {
    const rect = sentinel.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 720) {
      loadMore();
    }
  };
  const destroy = () => {
    observer?.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.clearTimeout(releaseTimer);
    sentinel.remove();
  };

  refresh();
  if (observer) {
    observer.observe(sentinel);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  return { sentinel, refresh, destroy, loadMore };
}

function ensureHomeFeedSentinel(root: ParentNode): HTMLElement {
  const existing = root.querySelector<HTMLElement>('.zhmt-home-autoload-sentinel');
  if (existing) {
    return existing;
  }

  const sentinel = document.createElement('div');
  sentinel.className = 'zhmt-home-autoload-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  const mainColumn = findHomeFeedContainer(root);
  (mainColumn || document.body).appendChild(sentinel);
  return sentinel;
}

function findHomeFeedContainer(root: ParentNode = document): HTMLElement | null {
  return root.querySelector<HTMLElement>(
    '[data-zhmt-immersive-wrapper="true"].zh-home-wrapper, .zhmt-modern-home-main, .Topstory-mainColumn, #TopstoryContent, .Topstory-container, .Topstory',
  );
}

export function findHomeLoadMoreButton(root: ParentNode = document): HTMLButtonElement | undefined {
  const buttons = HOME_LOAD_MORE_SELECTORS.flatMap((selector) => Array.from(root.querySelectorAll<HTMLButtonElement>(selector)));
  const seen = new Set<HTMLButtonElement>();

  return buttons.find((button) => {
    if (seen.has(button)) {
      return false;
    }

    seen.add(button);
    return isUsableLoadMoreButton(button);
  });
}

function isUsableLoadMoreButton(button: HTMLButtonElement): boolean {
  if (button.disabled || button.classList.contains('zhmt-hidden')) {
    return false;
  }

  const text = (button.textContent || '').replace(/\s+/g, '');
  if (!text.includes('加载更多')) {
    return false;
  }

  button.classList.add('zhmt-home-load-more');
  return true;
}

function findElementByText(text: string): HTMLElement | undefined {
  const elements = Array.from(document.body.querySelectorAll<HTMLElement>('div, section, span, button, textarea, input')).filter((element) => {
    const textContent = element.textContent || element.getAttribute('placeholder') || '';

    return textContent.includes(text);
  });

  return elements
    .sort((left, right) => {
      const leftText = left.textContent || left.getAttribute('placeholder') || '';
      const rightText = right.textContent || right.getAttribute('placeholder') || '';

      const leftRect = left.getBoundingClientRect();
      const rightRect = right.getBoundingClientRect();
      const leftRootPenalty = left === document.body || left.id === 'root' ? 1_000_000 : 0;
      const rightRootPenalty = right === document.body || right.id === 'root' ? 1_000_000 : 0;
      const leftArea = leftRect.width * leftRect.height;
      const rightArea = rightRect.width * rightRect.height;

      return leftRootPenalty - rightRootPenalty || leftText.length - rightText.length || leftArea - rightArea;
    })[0];
}

function markHomeComposer(composer: HTMLElement | undefined, pageRoot: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('.WriteArea').forEach((element) => {
    if (element.textContent?.includes('分享此刻') || element.querySelector('textarea, input, button')) {
      element.classList.add('zhmt-home-composer', 'zhmt-hidden');
      element.setAttribute('aria-hidden', 'true');
    }
  });

  if (!composer) {
    return;
  }

  const composerCard = findComposerAncestor(composer, pageRoot) || findCardLikeAncestor(composer, pageRoot);
  composerCard?.classList.add('zhmt-home-composer', 'zhmt-hidden');
  composerCard?.setAttribute('aria-hidden', 'true');
}

function findHomeFeedMain(composer: HTMLElement | undefined): HTMLElement | undefined {
  const candidates = Array.from(document.body.querySelectorAll<HTMLElement>('main, section, div')).filter((element) => {
    const rect = element.getBoundingClientRect();
    const text = element.textContent || '';

    return rect.width >= 560 && rect.width <= 760 && rect.height > 320 && looksLikeHomeFeedColumn(element, text);
  });

  if (candidates.length > 0) {
    return candidates.sort((left, right) => {
      const leftRect = left.getBoundingClientRect();
      const rightRect = right.getBoundingClientRect();
      return scoreHomeFeedColumn(right) - scoreHomeFeedColumn(left) || Math.abs(leftRect.width - 694) - Math.abs(rightRect.width - 694);
    })[0];
  }

  return composer ? findCardLikeAncestor(composer, document.body) : undefined;
}

function markHomeShellAndSidebars(feedMain: HTMLElement): void {
  let current: HTMLElement | null = feedMain;

  for (let depth = 0; current?.parentElement && current.parentElement !== document.body && depth < 5; depth += 1) {
    const parent: HTMLElement = current.parentElement;
    const siblings = Array.from(parent.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
    const sidebars = siblings.filter((child) => child !== current && isHomeSidebarColumn(child));

    if (sidebars.length > 0 || parent.classList.contains('Topstory-container')) {
      parent.classList.add('zhmt-modern-home-shell', 'zhmt-readable-shell');
      sidebars.forEach((child) => markHomeSidebarColumn(child));
    }

    current = parent;
  }
}

function markHomeSidebarByText(): void {
  Array.from(document.body.querySelectorAll<HTMLElement>('aside, section, div')).forEach((element) => {
    if (element.closest('[data-zhmt-immersive-wrapper="true"], .zhmt-modern-home-main, .zhmt-home-feed-item, .zhmt-home-composer')) {
      return;
    }

    if (isHomeSidebarColumn(element)) {
      markHomeSidebarColumn(element);
    }
  });
}

function markHomeSidebarColumn(element: HTMLElement): void {
  element.classList.add('zhmt-home-side-column', 'zhmt-hidden');
  element.setAttribute('aria-hidden', 'true');
}

function isHomeSidebarColumn(element: HTMLElement): boolean {
  const text = (element.textContent || '').replace(/\s+/g, '');
  if (!HOME_SIDEBAR_TEXT.test(text)) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const containsFeedSignals = element.querySelector('.ContentItem, .TopstoryItem, article, h2 a[href*="/question/"], h2 a[href*="/answer/"]');
  const hasSidebarShape = rect.width === 0 || rect.width <= 460 || element.matches('aside, [class*="side"], [class*="Side"]');
  return hasSidebarShape && !containsFeedSignals;
}

function looksLikeHomeFeedColumn(element: HTMLElement, text = element.textContent || ''): boolean {
  if (HOME_SIDEBAR_TEXT.test(text) && !HOME_COMPOSER_TEXT.test(text)) {
    return false;
  }

  const contentItemCount = element.querySelectorAll('.TopstoryItem, .ContentItem, article, h2').length;
  return (
    contentItemCount >= 2 ||
    ((HOME_COMPOSER_TEXT.test(text) || HOME_FEED_TEXT.test(text)) && element.querySelectorAll('h2, article, .ContentItem').length >= 1)
  );
}

function scoreHomeFeedColumn(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const text = element.textContent || '';
  const contentScore = Math.min(element.querySelectorAll('.TopstoryItem, .ContentItem, article, h2').length, 12) * 20;
  const composerScore = HOME_COMPOSER_TEXT.test(text) ? 40 : 0;
  const feedScore = HOME_FEED_TEXT.test(text) ? 30 : 0;
  const widthScore = 80 - Math.min(Math.abs(rect.width - 694), 80);
  const sidebarPenalty = HOME_SIDEBAR_TEXT.test(text) ? 80 : 0;
  return contentScore + composerScore + feedScore + widthScore - sidebarPenalty;
}

function findModernHomeFeedItems(): HTMLElement[] {
  const feedMain = findHomeFeedContainer();
  if (!feedMain) {
    return [];
  }

  return Array.from(feedMain.querySelectorAll<HTMLElement>('article, section, div')).filter((element) => {
    if (
      element.matches(HOME_FEED_CONTAINER_SELECTOR) ||
      element.classList.contains('zhmt-home-composer') ||
      element.classList.contains('zhmt-home-autoload-sentinel') ||
      element.closest('.zhmt-home-composer, .zhmt-home-feed-item, .zhmt-home-side-column, .TopstoryItem')
    ) {
      return false;
    }

    const text = element.textContent || '';
    const rect = element.getBoundingClientRect();
    const hasTitle = !!element.querySelector('h2, .ContentItem-title, a[href*="/question/"], a[href*="/answer/"], a[href*="/p/"]');
    const hasAction = HOME_FEED_TEXT.test(text);
    const isCardSized = rect.width === 0 || (rect.width >= 520 && rect.height >= 80);
    const nestedFeedSignals = element.querySelectorAll('.TopstoryItem, article, section, div').length > 6;
    return hasTitle && hasAction && isCardSized && !nestedFeedSignals;
  });
}

function findCardLikeAncestor(element: HTMLElement, stopAt: ParentNode): HTMLElement | undefined {
  let current: HTMLElement | null = element;

  while (current && current.parentElement && current.parentElement !== stopAt) {
    const rect = current.getBoundingClientRect();

    if (rect.width >= 560 && rect.height >= 80) {
      return current;
    }

    current = current.parentElement;
  }

  return undefined;
}

function findComposerAncestor(element: HTMLElement, stopAt: ParentNode): HTMLElement | undefined {
  let current: HTMLElement | null = element;

  while (current && current.parentElement && current.parentElement !== stopAt) {
    if (current.classList.contains('WriteArea') || current.classList.contains('Card')) {
      return current;
    }

    const text = current.textContent || '';
    const rect = current.getBoundingClientRect();
    if (text.includes('分享此刻') && rect.width >= 420 && rect.width <= 760 && rect.height >= 60 && rect.height <= 260) {
      return current;
    }

    current = current.parentElement;
  }

  return undefined;
}
