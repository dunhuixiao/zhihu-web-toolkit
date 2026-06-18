# zhihu-hide-toolkit

A Tampermonkey/Violentmonkey userscript toolkit for a quieter Zhihu reading experience.

The project keeps Zhihu's native fonts, colors, theme behavior, and core interaction buttons. It only hides noisy chrome and ads, adjusts the reading layout, and adds a small native-feeling floating toolkit.

## Scripts

```bash
npm install
npm run typecheck
npm run test
npm run build
npm run where
```

The installable userscript is generated at:

```text
dist/zhihu-hide-toolkit.user.js
```

## Chrome debug checklist

1. Rebuild with `npm run build`.
2. Replace the Tampermonkey script content with `dist/zhihu-hide-toolkit.user.js`, or run `npm run serve:dist` and open `http://127.0.0.1:8797/zhihu-hide-toolkit.user.js`.
3. Confirm the Tampermonkey script header shows `@name zhihu-hide-toolkit`, `@version 0.0.5`, and `@author you`.
4. Refresh Zhihu and search the Console for `[zhmt]`.

Expected startup logs:

```text
[zhmt] boot 0.0.5
[zhmt] ready
```

If those logs are missing, Tampermonkey is not running the updated script on the page. If `[zhmt] init failed` appears, use the error below that line as the next debugging target.
If the Console still mentions an old script id, finish the open Tampermonkey update page or disable/delete the stale copy before refreshing Zhihu again.

Expected DOM checks after startup:

```js
document.documentElement.classList.contains('zhmt-enabled') === true
document.querySelectorAll('.ContentItem-actions, .RichContent-actions').length > 0
document.querySelectorAll('#zh-tools-panel .zh-square-btn').length === 5
document.querySelector('.zh-copy-md-container') !== null
```

## Features

- Hide Zhihu header, persistent sidebars, app banners, recommendation chrome, and answer-area ads.
- Recenter and widen the readable content area without overriding Zhihu's typography or color system.
- Preserve Zhihu's native action buttons and side buttons instead of adding replacement controls.
- Support Zhihu main site and Zhihu column pages.
