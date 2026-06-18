import { toPng } from 'html-to-image';
import { downloadBlob, downloadTextFile, copyText } from '../core/download';
import { buildMarkdown } from './markdown';
import { buildOfflineHtml, findCurrentReadableContent, safeFilename } from './contentTarget';
import { showToast } from './toast';

export async function exportCurrentContentAsPng(): Promise<void> {
  const content = findCurrentReadableContent();

  if (!content) {
    showToast('未找到可导出的回答或文章');
    return;
  }

  showToast('正在生成 PNG...');

  try {
    const dataUrl = await toPng(content.element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
    });
    const blob = await (await fetch(dataUrl)).blob();
    downloadBlob(safeFilename(content.title, 'png'), blob);
    showToast('PNG 已生成');
  } catch (error) {
    console.error('[zhmt] PNG export failed', error);
    showToast('PNG 生成失败，请尝试滚动到目标回答后重试');
  }
}

export function saveCurrentContentAsHtml(): void {
  const content = findCurrentReadableContent();

  if (!content) {
    showToast('未找到可保存的回答或文章');
    return;
  }

  const html = buildOfflineHtml(content);
  downloadTextFile(safeFilename(content.title, 'html'), html, 'text/html;charset=utf-8');
  showToast('已保存 HTML');
}

export async function copyCurrentContentAsMarkdown(): Promise<void> {
  const content = findCurrentReadableContent();

  if (!content) {
    showToast('未找到可复制的回答或文章');
    return;
  }

  const markdown = buildMarkdown(content);
  await copyText(markdown);
  showToast('已复制 Markdown');
}
