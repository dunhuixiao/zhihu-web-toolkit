export function syncNativeTokens(): void {
  const bodyStyles = window.getComputedStyle(document.body);
  const rootStyles = window.getComputedStyle(document.documentElement);
  const primaryButton = document.querySelector<HTMLElement>('.Button--primary, .Button--blue');
  const card = document.querySelector<HTMLElement>(
    '.QuestionHeader, .Post-content, .AppHeader, .TopstoryTabs, .SearchBar, .Card:not(.zhmt-home-composer):not([data-zhmt-immersive-wrapper])',
  );
  const subtleProbe = document.querySelector<HTMLElement>(
    '.Input, .SearchBar-input, .CommentEditor, .RichContent-actions, .ContentItem-actions, .QuestionRichText',
  );
  const codeProbe = document.querySelector<HTMLElement>('pre, code, .Highlight, .ztext pre');

  const primaryStyles = primaryButton ? window.getComputedStyle(primaryButton) : undefined;
  const cardStyles = card ? window.getComputedStyle(card) : undefined;
  const subtleStyles = subtleProbe ? window.getComputedStyle(subtleProbe) : undefined;
  const codeStyles = codeProbe ? window.getComputedStyle(codeProbe) : undefined;

  const bg = firstSolidColor(bodyStyles.backgroundColor, rootStyles.backgroundColor, '#ffffff');
  const text = firstSolidColor(bodyStyles.color, rootStyles.color, '#1a1a1a');
  const surface = firstSolidColor(cssVar(rootStyles, '--GBK99A'), cardStyles?.backgroundColor, cssVar(rootStyles, '--GBK10A'), bg);
  const border = firstSolidColor(
    cssVar(rootStyles, '--GBK08A'),
    cssVar(rootStyles, '--GBK09A'),
    cssVar(rootStyles, '--GBK10A'),
    'rgba(128, 128, 128, 0.22)',
  );
  const primary = firstSolidColor(
    primaryStyles?.backgroundColor,
    cssVar(rootStyles, '--Brand-1'),
    cssVar(rootStyles, '--Blue-1'),
    '#1772f6',
  );
  const primaryText = firstSolidColor(primaryStyles?.color, '#ffffff');
  const subtle = firstSolidColor(
    subtleStyles?.backgroundColor,
    cssVar(rootStyles, '--GBK10A'),
    cssVar(rootStyles, '--GBK09A'),
    cssVar(rootStyles, '--GBK01A'),
    surface,
    bg,
  );
  const code = firstSolidColor(
    codeStyles?.backgroundColor,
    cssVar(rootStyles, '--GBK10A'),
    cssVar(rootStyles, '--GBK09A'),
    cssVar(rootStyles, '--GBK01A'),
    subtle,
    surface,
  );

  const root = document.documentElement;
  root.style.setProperty('--zhmt-native-bg', bg);
  root.style.setProperty('--zhmt-native-text', text);
  root.style.setProperty('--zhmt-native-surface', surface);
  root.style.setProperty('--zhmt-native-border', border);
  root.style.setProperty('--zhmt-native-primary', primary);
  root.style.setProperty('--zhmt-native-primary-text', primaryText);

  root.style.setProperty('--zh-bg', bg);
  root.style.setProperty('--zh-paper', surface);
  root.style.setProperty('--zh-text', text);
  root.style.setProperty('--zh-title', text);
  root.style.setProperty('--zh-accent', primary);
  root.style.setProperty('--zh-border', border);
  root.style.setProperty('--zh-quote', subtle);
  root.style.setProperty('--zh-code', code);
  root.style.setProperty('--zh-modal-bg', surface);
}

function cssVar(styles: CSSStyleDeclaration, name: string): string | undefined {
  return styles.getPropertyValue(name).trim() || undefined;
}

function firstSolidColor(...values: Array<string | undefined>): string {
  return values.find((value) => {
    const color = (value || '').trim();
    return color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)';
  })!;
}
