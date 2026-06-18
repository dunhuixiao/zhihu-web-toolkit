export function renderLucideIcons(root: Element | Document = document): void {
  root.querySelectorAll<HTMLElement>('[data-lucide]').forEach((placeholder) => {
    const icon = placeholder.dataset.lucide;
    const svg = icon ? icons[icon] : undefined;

    if (!svg) {
      return;
    }

    placeholder.outerHTML = svg;
  });
}

const baseAttrs =
  'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const icons: Record<string, string> = {
  copy: `<svg ${baseAttrs}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  'clipboard-copy': `<svg ${baseAttrs}><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>`,
  'chevron-down': `<svg ${baseAttrs}><path d="m6 9 6 6 6-6"/></svg>`,
  'image-down': `<svg ${baseAttrs}><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/><path d="M19 16v6"/><path d="m22 19-3 3-3-3"/></svg>`,
  save: `<svg ${baseAttrs}><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>`,
  shield: `<svg ${baseAttrs}><path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.5a1.3 1.3 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  'sun-moon': `<svg ${baseAttrs}><path d="M12 8a2.8 2.8 0 0 0-4 4 2.8 2.8 0 0 0 4-4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/><path d="M20.9 15.1A6.5 6.5 0 0 1 8.9 3.1"/></svg>`,
  'user-round': `<svg ${baseAttrs}><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
  x: `<svg ${baseAttrs}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
};
