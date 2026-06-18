import TurndownService from 'turndown';
import type { ReadableContent } from './contentTarget';

export function buildMarkdown(content: ReadableContent): string {
  const cloned = content.element.cloneNode(true) as HTMLElement;
  cloned.querySelectorAll('script, style, noscript, .zhmt-toolbar, .zhmt-modal').forEach((element) => element.remove());

  const turndown = createTurndownService();
  const body = turndown.turndown(cloned.innerHTML).trim();

  return [`# ${content.title}`, '', `> 作者：${content.author}`, `> 来源：${content.url}`, '', body].join('\n');
}

export function createTurndownService(): TurndownService {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });

  turndown.addRule('zhihuImages', {
    filter: 'img',
    replacement: (_content, node) => {
      const image = node as HTMLImageElement;
      const src = image.currentSrc || image.src || image.getAttribute('data-original') || image.getAttribute('data-actualsrc');
      const alt = image.alt || 'image';

      return src ? `![${alt}](${src})` : '';
    },
  });

  turndown.addRule('lineBreaks', {
    filter: 'br',
    replacement: () => '\n',
  });

  return turndown;
}
