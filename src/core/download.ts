export function downloadTextFile(filename: string, content: string, type = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type });
  downloadBlob(filename, blob);
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);

  try {
    if (typeof GM_download === 'function') {
      GM_download({
        url,
        name: filename,
        saveAs: true,
        onload: () => URL.revokeObjectURL(url),
        onerror: () => {
          URL.revokeObjectURL(url);
          anchorDownload(filename, blob);
        },
      });
      return;
    }

    anchorDownload(filename, blob);
  } catch {
    URL.revokeObjectURL(url);
    anchorDownload(filename, blob);
  }
}

export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to userscript API.
    }
  }

  if (typeof GM_setClipboard === 'function') {
    GM_setClipboard(text, 'text');
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function anchorDownload(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
