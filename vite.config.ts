import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  build: {
    target: 'es2018',
    cssTarget: 'chrome80',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
  },
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'zhihu-hide-toolkit',
        version: packageJson.version,
        author: 'you',
        match: ['https://www.zhihu.com/*', 'https://zhihu.com/*', 'https://zhuanlan.zhihu.com/*'],
        grant: [
          'GM_addStyle',
          'GM_getValue',
          'GM_setValue',
          'GM_download',
          'GM_setClipboard',
          'GM_xmlhttpRequest',
        ],
        connect: ['www.zhihu.com', 'zhihu.com', 'zhuanlan.zhihu.com', '*.zhimg.com'],
      },
      build: {
        fileName: 'zhihu-hide-toolkit.user.js',
      },
    }),
  ],
});
