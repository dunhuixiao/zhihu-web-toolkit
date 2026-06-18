import { describe, expect, it } from 'vitest';
import { hideElementsBySelectors, injectStyle } from '../src/core/dom';

describe('dom helpers', () => {
  it('marks matching elements hidden', () => {
    document.body.innerHTML = '<header class="AppHeader"></header><main></main>';

    expect(hideElementsBySelectors(['.AppHeader'])).toBe(1);
    expect(document.querySelector('.AppHeader')?.classList.contains('zhmt-hidden')).toBe(true);
  });

  it('injects a replaceable toolkit style tag after existing styles', () => {
    document.head.innerHTML = '<style data-zhmt="style">old</style><style id="other-style">base</style>';

    injectStyle('.new-style{}');

    const styles = Array.from(document.head.querySelectorAll('style'));
    expect(styles).toHaveLength(2);
    expect(styles[1]?.getAttribute('data-zhmt')).toBe('style');
    expect(styles[1]?.textContent).toBe('.new-style{}');
    expect(document.head.querySelectorAll('style[data-zhmt="style"]')).toHaveLength(1);
  });
});
