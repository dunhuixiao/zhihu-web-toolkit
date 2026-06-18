import { describe, expect, it } from 'vitest';
import { buildMarkdown } from '../src/features/markdown';

describe('markdown export', () => {
  it('builds markdown with metadata and body', () => {
    const element = document.createElement('article');
    element.innerHTML = '<p>你好 <strong>知乎</strong></p><img src="https://example.com/a.png" alt="图">';

    const markdown = buildMarkdown({
      element,
      title: '标题',
      author: '作者',
      url: 'https://www.zhihu.com/question/1/answer/2',
    });

    expect(markdown).toContain('# 标题');
    expect(markdown).toContain('> 作者：作者');
    expect(markdown).toContain('你好 **知乎**');
    expect(markdown).toContain('![图](https://example.com/a.png)');
  });
});
