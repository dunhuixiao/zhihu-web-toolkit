import { afterEach, describe, expect, it } from 'vitest';
import { cleanZhihuTitle, getTitle } from '../src/features/contentTarget';

describe('content target title', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.title = '';
  });

  it('removes Chrome notification prefixes from Zhihu titles', () => {
    expect(cleanZhihuTitle('(2 条消息) 期权为什么可以用股票和无风险借贷来复制定价，原理是什么? - 知乎')).toBe(
      '期权为什么可以用股票和无风险借贷来复制定价，原理是什么? - 知乎',
    );
    expect(cleanZhihuTitle('（12 条消息）首页 - 知乎')).toBe('首页 - 知乎');
  });

  it('cleans document title fallback before exporting', () => {
    document.title = '(2 条消息) 期权为什么可以用股票和无风险借贷来复制定价，原理是什么? - 知乎';

    expect(getTitle()).toBe('期权为什么可以用股票和无风险借贷来复制定价，原理是什么?');
  });
});
