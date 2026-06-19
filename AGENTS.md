# AGENTS.md

## Project Overview

`zhihu-web-toolkit` is a modular Tampermonkey userscript for cleaning up the Zhihu web UI.

The production userscript is built from TypeScript with Vite and `vite-plugin-monkey`. It should preserve the existing behaviors:

- Rebuild the Zhihu header into a custom toolkit header.
- Hide configured Zhihu cards, sidebars, footer, write area, and original top banner/header.
- Move `.css-ruapjk` into the rebuilt header.
- Expose idempotent debug APIs through `window.__zhihuWebToolkit`.

## Repository Layout

- `src/main.ts`: userscript entrypoint. Keep it thin; it should only install/start the toolkit.
- `src/toolkit.ts`: top-level toolkit API, lifecycle, report, install, apply, and destroy orchestration.
- `src/features/header-toolkit/`: header rebuild logic, header item lookup, node movement, and extra header controls.
- `src/features/hide-elements/`: style generation and style injection/removal for hidden elements.
- `src/shared/`: constants, DOM helpers, state, and public types.
- `tests/`: Vitest/jsdom fixtures and behavior tests.
- `dist/`: generated userscript output. Do not edit files here by hand.
- `src/zhihu-web-toolkit.console.js`: historical console-script reference/manual test artifact. Do not add new feature work here unless explicitly requested.

## Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run typecheck`: run TypeScript checks.
- `npm run test`: run Vitest/jsdom tests.
- `npm run build`: build `dist/zhihu-web-toolkit.user.js`.
- `npm audit --audit-level=moderate`: check dependency audit status.

## Coding Rules

- Use TypeScript strict-mode friendly code.
- Keep feature logic out of `src/main.ts`; add behavior in feature modules or `src/toolkit.ts`.
- Keep DOM selectors and stable attributes centralized in `src/shared/constants.ts` or feature config files.
- When adding a new Zhihu class to hide, update `HIDE_SELECTORS` in `src/shared/constants.ts` and add/adjust tests.
- DOM mutations must be idempotent. Repeated `apply()` calls must not create duplicate headers, styles, or moved nodes.
- DOM mutations must be reversible. `destroy()` should restore moved nodes using placeholders and remove injected styles/header nodes.
- Preserve the debug API: `window.__zhihuWebToolkit`.
- Do not manually edit `dist/`; run `npm run build` instead.
- Avoid reading or depending on cookies, localStorage, sessionStorage, or private account state.

## Testing Rules

- For ordinary source changes, run at least:
  - `npm run typecheck`
  - `npm run test`
- For changes affecting build config, userscript metadata, entrypoints, or dependencies, also run:
  - `npm run build`
  - `npm audit --audit-level=moderate`
- Add or update jsdom tests when behavior changes, especially for:
  - Hidden selector injection.
  - Original header/banner hiding.
  - Rebuilt header contents.
  - `.css-ruapjk` movement.
  - `apply()` idempotency.
  - `destroy()` restoration.
- For real Zhihu DOM changes, verify by injecting `dist/zhihu-web-toolkit.user.js` into an authenticated `https://www.zhihu.com/` page and checking `window.__zhihuWebToolkit.report()`.

## Browser Verification

When browser verification is needed:

- Use the current built userscript from `dist/zhihu-web-toolkit.user.js`.
- Verify that the rebuilt header exists once.
- Verify that the original `AppHeader`/top banner is hidden.
- Verify that configured hidden selectors have `visibleCount: 0`.
- Verify that `.css-ruapjk` is inside the rebuilt header and visible.
- Verify that the header is not fixed and scrolls with the page.
- Verify that `window.__zhihuWebToolkit` exists.

## Safety Notes

- Do not submit forms, publish content, send messages, change account settings, or trigger account side effects during verification.
- Do not inspect cookies, localStorage, sessionStorage, saved passwords, or browser profile internals.
- Browser checks should be limited to DOM injection, visibility checks, scroll behavior, and debug API reports.
