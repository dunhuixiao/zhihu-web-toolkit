import { describe, expect, it } from 'vitest';
import { buildThemeUrl } from '../src/features/theme';

describe('theme url', () => {
  it('sets theme and preserves existing query and hash', () => {
    expect(buildThemeUrl('https://www.zhihu.com/question/1?foo=bar#answer', 'dark')).toBe(
      'https://www.zhihu.com/question/1?foo=bar&theme=dark#answer',
    );
  });

  it('replaces existing theme', () => {
    expect(buildThemeUrl('https://www.zhihu.com/?theme=light', 'dark')).toBe('https://www.zhihu.com/?theme=dark');
  });
});
