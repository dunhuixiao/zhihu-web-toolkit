import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('native token mapping', () => {
  it('does not synthesize custom dark palette colors', () => {
    const source = readFileSync(resolve('src/core/nativeTokens.ts'), 'utf8');

    expect(source).not.toMatch(/mixColor|overlayAlpha|parseRgb/);
    expect(source).toContain("cssVar(rootStyles, '--GBK08A')");
    expect(source).toContain("root.style.setProperty('--zh-bg', bg)");
    expect(source).toContain("root.style.setProperty('--zh-paper', surface)");
    expect(source).toContain("root.style.setProperty('--zh-quote', subtle)");
    expect(source).toContain("root.style.setProperty('--zh-code', code)");
  });

  it('syncs native tokens before injecting toolkit styles', () => {
    const source = readFileSync(resolve('src/main.ts'), 'utf8');
    const tokenSyncIndex = source.indexOf('syncNativeTokens();');
    const styleInjectIndex = source.indexOf('injectStyle(styleText);');

    expect(tokenSyncIndex).toBeGreaterThan(-1);
    expect(styleInjectIndex).toBeGreaterThan(-1);
    expect(tokenSyncIndex).toBeLessThan(styleInjectIndex);
  });

  it('does not let local UI mutations trigger full page refresh loops', () => {
    const source = readFileSync(resolve('src/main.ts'), 'utf8');

    expect(source).toContain('isPageContentMutation');
    expect(source).toContain('#zh-tools-panel, .zh-copy-md-container, .zhmt-modal, .zhmt-toast, #zh-toast');
    expect(source).toContain('}, 500);');
  });
});
