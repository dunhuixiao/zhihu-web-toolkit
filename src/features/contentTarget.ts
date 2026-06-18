import { escapeHtml, isVisibleElement } from '../core/dom';
import { READABLE_SELECTORS } from '../core/selectors';

export interface ReadableContent {
  element: HTMLElement;
  title: string;
  author: string;
  url: string;
}

export function findCurrentReadableContent(): ReadableContent | undefined {
  const element = findReadableElement();

  if (!element) {
    return undefined;
  }

  return {
    element,
    title: getTitle(),
    author: getAuthor(element),
    url: window.location.href,
  };
}

export function findReadableElement(root: ParentNode = document): HTMLElement | undefined {
  const candidates = READABLE_SELECTORS.flatMap((selector) => Array.from(root.querySelectorAll<HTMLElement>(selector)));
  const visibleCandidates = candidates.filter(isVisibleElement);

  if (visibleCandidates.length === 0) {
    return undefined;
  }

  const viewportMiddle = window.innerHeight / 2;

  const selected = visibleCandidates
    .map((element) => ({
      element,
      distance: Math.abs(element.getBoundingClientRect().top - viewportMiddle),
      area: element.getBoundingClientRect().width * element.getBoundingClientRect().height,
    }))
    .sort((left, right) => left.distance - right.distance || right.area - left.area)[0];

  return selected ? selected.element : undefined;
}

export function getTitle(): string {
  const titleElement = document.querySelector<HTMLElement>('.QuestionHeader-title, .Post-Title, h1, .ContentItem-title');
  const title = (titleElement && titleElement.textContent ? titleElement.textContent.trim() : '') || document.title.replace(/ - 知乎$/, '').trim();

  return cleanZhihuTitle(title) || '知乎内容';
}

export function cleanZhihuTitle(title: string): string {
  return title.replace(/^[（(]\d+\s*条消息[)）]\s*/, '').trim();
}

export function getAuthor(root: ParentNode = document): string {
  const authorElement = root.querySelector<HTMLElement>(
    '.AuthorInfo-name, .UserLink-link, .AuthorInfo .Popover a, .Post-Author .UserLink-link',
  );

  return (authorElement && authorElement.textContent ? authorElement.textContent.trim() : '') || '知乎用户';
}

export function buildOfflineHtml(content: ReadableContent): string {
  const cloned = content.element.cloneNode(true) as HTMLElement;
  cloned.querySelectorAll('script, style, noscript, .zhmt-toolbar, .zhmt-modal').forEach((element) => element.remove());

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(content.title)}</title>
  <style>
    body {
      max-width: 760px;
      margin: 32px auto;
      padding: 0 20px 48px;
      font-family: inherit;
      color: #1a1a1a;
      background: #fff;
    }
    img, video { max-width: 100%; height: auto; }
    pre, code { white-space: pre-wrap; word-break: break-word; }
    .meta { margin-bottom: 24px; color: #646464; font-size: 14px; }
    .meta a { color: inherit; }
  </style>
</head>
<body>
  <h1>${escapeHtml(content.title)}</h1>
  <div class="meta">
    <div>作者：${escapeHtml(content.author)}</div>
    <div>来源：<a href="${escapeHtml(content.url)}">${escapeHtml(content.url)}</a></div>
    <div>保存时间：${escapeHtml(new Date().toLocaleString())}</div>
  </div>
  ${cloned.outerHTML}
</body>
</html>`;
}

export function safeFilename(value: string, extension: string): string {
  const basename = value
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

  return `${basename || 'zhihu-content'}.${extension}`;
}
