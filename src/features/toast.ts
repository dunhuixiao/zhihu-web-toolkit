import { createElement } from '../core/dom';

let toastTimer: number | undefined;

export function showToast(message: string): void {
  let toast = document.querySelector<HTMLElement>('.zhmt-toast');

  if (!toast) {
    toast = createElement('div', {
      className: 'zhmt-toast',
      attrs: {
        id: 'zh-toast',
        role: 'status',
        'aria-live': 'polite',
      },
    });
    document.body.appendChild(toast);
  } else if (!toast.id) {
    toast.id = 'zh-toast';
  }

  toast.textContent = message;
  toast.classList.add('zhmt-toast--visible', 'zh-toast-show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast?.classList.remove('zhmt-toast--visible', 'zh-toast-show');
  }, 2200);
}
