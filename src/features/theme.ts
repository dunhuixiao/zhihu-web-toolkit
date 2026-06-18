export type ThemeMode = 'dark' | 'light';

export function switchTheme(): void {
  const currentTheme = getCurrentTheme();
  const nextTheme: ThemeMode = currentTheme === 'dark' ? 'light' : 'dark';
  window.location.assign(buildThemeUrl(window.location.href, nextTheme));
}

export function getCurrentTheme(): ThemeMode {
  const theme = new URL(window.location.href).searchParams.get('theme');

  if (theme === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark') {
    return 'dark';
  }

  return 'light';
}

export function buildThemeUrl(inputUrl: string, theme: ThemeMode): string {
  const url = new URL(inputUrl);
  url.searchParams.set('theme', theme);
  return url.toString();
}
