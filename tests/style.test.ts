import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('stylesheet typography guard', () => {
  it('does not introduce KaiTi or global font-family overrides', () => {
    const css = readFileSync(resolve('src/styles/toolkit.css'), 'utf8');
    const contentTarget = readFileSync(resolve('src/features/contentTarget.ts'), 'utf8');

    expect(css).not.toMatch(/楷体|KaiTi|Kaiti|STKaiti/i);
    expect(css).not.toMatch(/(^|})\s*(html|body|\*)[^{]*{[^}]*font-family\s*:/i);
    expect(contentTarget).not.toMatch(/楷体|KaiTi|Kaiti|STKaiti/i);
    const exportedFontFamilies = Array.from(contentTarget.matchAll(/font-family:\s*([^;]+)/gi)).map((match) => match[1].trim());
    expect(exportedFontFamilies).toEqual(['inherit']);
  });

  it('keeps the native-width home feed and reference reader shell contract', () => {
    const css = readFileSync(resolve('src/styles/toolkit.css'), 'utf8');
    const homeRules = Array.from(css.matchAll(/html\.zhmt-page-home[^{]*\{[^}]*\}/g)).map((match) => match[0]).join('\n');
    const homeMainRule = css.match(
      /html\.zhmt-page-home \.Topstory-mainColumn,[\s\S]*?html\.zhmt-page-home #immersive-wrapper\.zh-home-wrapper \{[\s\S]*?\n\}/,
    )?.[0] || '';
    const homeWrapperOverride = css.match(
      /html\.zhmt-page-home #immersive-wrapper\.zh-home-wrapper,[\s\S]*?html\.zhmt-page-home \[data-zhmt-immersive-wrapper="true"\]\.zh-home-wrapper \{[\s\S]*?\n\}/,
    )?.[0] || '';
    const homeShellRule = css.match(
      /html\.zhmt-page-home \.Topstory,[\s\S]*?html\.zhmt-page-home \.zhmt-modern-home-shell \{[\s\S]*?\n\}/,
    )?.[0] || '';
    const homeNativeContainerRule = css.match(
      /html\.zhmt-page-home \.Topstory-container,[\s\S]*?html\.zhmt-page-home \.zhmt-modern-home-shell \{\n  box-sizing:[\s\S]*?\n\}/,
    )?.[0] || '';
    const homeCardRule = css.match(
      /html\.zhmt-page-home \[data-zhmt-immersive-wrapper="true"\] \.zhmt-home-feed-item,[\s\S]*?html\.zhmt-page-home #immersive-wrapper \.zh-home-card \{[\s\S]*?\n\}/,
    )?.[0] || '';
    const homeContentRule = css.match(
      /html\.zhmt-page-home \[data-zhmt-immersive-wrapper="true"\] \.zhmt-home-feed-item > \.ContentItem,[\s\S]*?html\.zhmt-page-home #immersive-wrapper \.zhmt-home-feed-item \.RichContent-inner \{[\s\S]*?\n\}/,
    )?.[0] || '';

    expect(css).toContain('max-width: 760px !important');
    expect(css).toContain('max-width: 694px !important');
    expect(css).toContain('html.zhmt-enabled.zhmt-page-question-detail body #immersive-wrapper.zh-question-wrapper');
    expect(css).toContain('padding: 60px 80px !important');
    expect(css).toContain('html.zhmt-page-question-detail body');
    expect(css).toContain('padding: 50px 0 !important');
    const enabledBodyRule = css.match(/html\.zhmt-enabled body \{[\s\S]*?\n\}/)?.[0] || '';
    const readerBodyRule = css.match(/html\.zhmt-page-question-detail body,[\s\S]*?html\.zhmt-page-post body \{[\s\S]*?\n\}/)?.[0] || '';
    expect(enabledBodyRule).not.toContain('background-color');
    expect(readerBodyRule).toContain('background-color: var(--zh-bg');
    expect(css).toContain('border-bottom: 1px solid var(--zh-border');
    expect(css).toContain('html.zhmt-page-home .WriteArea');
    expect(css).toContain('html.zhmt-page-home .zhmt-home-side-column');
    expect(css).not.toContain('html.zhmt-page-home .zh-feed-head');
    expect(css).not.toContain('html.zhmt-page-home .zh-home-title');
    expect(css).toContain('html.zhmt-page-home .Topstory-mainColumnCard');
    expect(css).toContain('html.zhmt-page-home #TopstoryContent');
    expect(css).toContain('html.zhmt-page-home .Topstory-recommend');
    expect(css).toContain('width: 694px !important');
    expect(css).toContain('max-width: 694px !important');
    expect(css).toContain('padding: 0 0 72px !important');
    expect(css).toContain('margin-left: 0 !important');
    expect(css).not.toContain('width: min(100%, 694px) !important');
    expect(homeShellRule).toContain('justify-content: flex-start !important');
    expect(homeShellRule).not.toContain('justify-content: center !important');
    expect(homeNativeContainerRule).toContain('width: 1000px !important');
    expect(homeNativeContainerRule).toContain('margin-left: auto !important');
    expect(homeNativeContainerRule).toContain('margin-right: auto !important');
    expect(homeMainRule).not.toContain('margin: 0 auto !important');
    expect(homeWrapperOverride).toContain('margin-left: 0 !important');
    expect(homeWrapperOverride).toContain('margin-right: 0 !important');
    expect(homeWrapperOverride).toContain('margin: 0 !important');
    expect(homeWrapperOverride).toContain('color: inherit !important');
    expect(homeWrapperOverride).toContain('font-size: inherit !important');
    const homeResponsiveRule = css.match(
      /@media \(max-width: 860px\) \{[\s\S]*?html\.zhmt-page-home #immersive-wrapper\.zh-home-wrapper \{[\s\S]*?\n  \}/,
    )?.[0] || '';
    expect(homeResponsiveRule).toContain('margin-left: 0 !important');
    expect(homeResponsiveRule).toContain('margin-right: 0 !important');
    expect(homeResponsiveRule).not.toContain('margin-left: auto !important');
    expect(homeResponsiveRule).not.toContain('margin-right: auto !important');
    expect(css).toContain('margin: 0 0 16px !important');
    expect(css).toContain('font-size: inherit !important');
    expect(css).toContain('line-height: inherit !important');
    expect(css).toContain('html.zhmt-page-home [data-zhmt-immersive-wrapper="true"] a');
    expect(css).toContain('border-bottom: 0 !important');
    expect(css).toContain('border: 1px solid var(--zh-border');
    expect(css).toContain('@keyframes zh-page-enter');
    expect(css).toContain('html.zhmt-page-question-detail .zh-question-detail {');
    expect(css).toContain('html.zhmt-page-question-detail .zh-question-toolbar');
    expect(css).toContain('html.zhmt-page-question-detail .Reward');
    expect(css).toContain('html.zhmt-page-question-detail #immersive-wrapper img.Avatar');
    expect(css).toContain('box-shadow: none !important;');
    expect(css).toContain('.zhmt-home-feed-item > .ContentItem');
    expect(css).toContain('.zh-home-card');
    expect(css).toContain('.zh-home-card-title');
    expect(css).toContain('.zh-home-card-snippet');
    expect(homeCardRule).not.toMatch(/background\s*:/);
    expect(homeCardRule).not.toMatch(/background-color\s*:/);
    expect(homeCardRule).not.toMatch(/border\s*:/);
    expect(homeCardRule).not.toContain('box-shadow');
    expect(homeContentRule).not.toMatch(/background\s*:/);
    expect(homeContentRule).not.toMatch(/background-color\s*:/);
    expect(homeContentRule).not.toMatch(/border\s*:/);
    expect(homeContentRule).not.toContain('box-shadow');
    const homeBackgroundDeclarations = Array.from(homeRules.matchAll(/(?:^|\n)\s*background(?:-color)?\s*:\s*([^;]+)/g)).map((match) =>
      match[1].trim(),
    );
    const homeColorDeclarations = Array.from(homeRules.matchAll(/(?:^|\n)\s*color\s*:\s*([^;]+)/g)).map((match) => match[1].trim());
    expect(homeBackgroundDeclarations.every((value) => /^(transparent|0\s+0)\b/.test(value))).toBe(true);
    expect(homeColorDeclarations.every((value) => /^inherit\b/.test(value))).toBe(true);
    expect(homeRules).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(homeRules).not.toMatch(/rgba?\(/i);
    expect(css).not.toContain('opacity: 0.62 !important');
    expect(css).not.toContain('opacity: 0.85 !important');
    expect(css).not.toMatch(/html\.zhmt-page-home[\s\S]{0,500}\.zh-home-card-title[\s\S]{0,500}color:\s*var\(--zh-title/);
    expect(css).not.toMatch(/html\.zhmt-page-home[\s\S]{0,500}\.zh-home-card-snippet[\s\S]{0,500}color:\s*var\(--zh-text/);
    expect(css).not.toMatch(/\.zh-home-grid/);
    expect(css).not.toMatch(/html\.zhmt-page-home[\s\S]*?#immersive-wrapper \.ContentItem \{/);
    expect(css).not.toMatch(/html\.zhmt-enabled body\s*{[^}]*padding:/);
  });

  it('keeps the reference floating controls without custom palette features', () => {
    const css = readFileSync(resolve('src/styles/toolkit.css'), 'utf8');
    const toolbarSource = readFileSync(resolve('src/features/toolbar.ts'), 'utf8');

    expect(css).toContain('right: 30px !important');
    expect(css).toContain('bottom: 30px !important');
    expect(css).toContain('z-index: 999999 !important');
    expect(css).toContain('transition: opacity 0.3s !important');
    expect(css).toContain('gap: 10px !important');
    expect(css).toContain('visibility: visible !important');
    expect(css).toContain('width: 38px !important');
    expect(css).toContain('height: 38px !important');
    expect(css).toContain('border-radius: 4px !important');
    expect(css).toContain('.zhmt-toolbar__tooltip');
    expect(css).toContain('transition: opacity 0.08s ease');
    expect(css).toContain('.zh-square-btn:hover .zhmt-toolbar__tooltip');
    expect(css).toContain('.zh-square-btn.zh-btn-disabled');
    expect(css).toContain('top: 20px !important');
    expect(css).toContain('right: 80px !important');
    expect(toolbarSource).not.toMatch(/github|help|translate|radar/i);
    expect(toolbarSource).not.toMatch(/THEMES|palette|custom theme/i);
  });

  it('does not wipe the immersive paper styling from the question header', () => {
    const css = readFileSync(resolve('src/styles/toolkit.css'), 'utf8');
    const resetRule = css.match(/html\.zhmt-page-question-detail \.Question-mainColumn,[\s\S]*?html\.zhmt-page-post \.Post-RichText \{/);

    expect(css).toContain('html.zhmt-page-question-detail .QuestionHeader {');
    expect(css).toContain('html.zhmt-page-question-detail .zh-question-title');
    expect(css).toContain('html.zhmt-page-question-detail .QuestionHeader-detail.zh-question-detail');
    expect(css).toContain('html.zhmt-page-question-detail #immersive-wrapper .zh-question-answer-view');
    expect(css).toContain('html.zhmt-page-question-detail .QuestionHeader {');
    expect(css).toContain('background: transparent !important;');
    expect(css).toContain('border-left: 2px solid var(--zh-accent');
    expect(css).toContain('max-width: 760px !important');
    expect(css).toContain('min-width: 0 !important');
    expect(css).not.toContain('html.zhmt-page-question-detail .QuestionHeader ~ .Question-main #immersive-wrapper.zh-question-wrapper');
    expect(css).not.toContain('padding: 30px 18px 18px !important');
    expect(css).not.toContain('max-width: 820px !important');
    expect(resetRule?.[0] || '').not.toContain('.QuestionHeader,');
  });

  it('keeps reference-style modal and local panel treatment without font overrides', () => {
    const css = readFileSync(resolve('src/styles/toolkit.css'), 'utf8');

    expect(css).toContain('border: 2px solid var(--zh-accent');
    expect(css).toContain('border-bottom: 1px dashed var(--zh-accent');
    expect(css).toContain('box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3)');
    expect(css).toContain('@keyframes zh-modal-fade-in');
    expect(css).toContain('@keyframes zh-modal-pop-out');
    expect(css).toContain('@keyframes zh-space-enter');
    expect(css).toContain('.zhmt-profile-panel #zh-space-container');
    expect(css).toContain('.zhmt-blocklist-panel {');
    expect(css).toContain('width: min(420px, 90vw) !important');
    expect(css).toContain('.zhmt-profile-panel .zh-space-avatar:hover');
    expect(css).toContain('@media (max-width: 900px)');
    expect(css).toContain('flex-flow: row wrap !important');
    expect(css).not.toMatch(/\.zh-modal[\s\S]{0,220}font-family\s*:/i);
  });
});
