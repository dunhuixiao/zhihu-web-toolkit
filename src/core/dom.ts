export function onDomReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
}

export function injectStyle(cssText: string): void {
  document.querySelectorAll<HTMLStyleElement>('style[data-zhmt="style"]').forEach((style) => style.remove());
  const style = document.createElement('style');
  style.dataset.zhmt = 'style';
  style.textContent = cssText;
  document.head.appendChild(style);
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: {
    className?: string;
    text?: string;
    html?: string;
    attrs?: Record<string, string>;
  } = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.html !== undefined) {
    element.innerHTML = options.html;
  }

  Object.entries(options.attrs || {}).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  return element;
}

export function hideElementsBySelectors(selectors: string[], root: ParentNode = document): number {
  let count = 0;

  selectors.forEach((selector) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      if (!element.classList.contains('zhmt-hidden')) {
        count += 1;
      }

      element.classList.add('zhmt-hidden');
      element.setAttribute('aria-hidden', 'true');
    });
  });

  return count;
}

export function isVisibleElement(element: Element): boolean {
  const htmlElement = element as HTMLElement;
  const rect = htmlElement.getBoundingClientRect();
  const styles = window.getComputedStyle(htmlElement);

  return rect.width > 0 && rect.height > 0 && styles.display !== 'none' && styles.visibility !== 'hidden';
}

export function escapeHtml(value: string): string {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

export function removeElements(selectors: string[], root: ParentNode): void {
  selectors.forEach((selector) => {
    root.querySelectorAll(selector).forEach((element) => element.remove());
  });
}

export function debounce<TArgs extends unknown[]>(callback: (...args: TArgs) => void, wait: number) {
  let timeoutId: number | undefined;

  return (...args: TArgs) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
}
