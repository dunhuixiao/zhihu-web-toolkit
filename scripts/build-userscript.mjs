import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const outFile = path.resolve('dist/zhihu-hide-menu-toolkit.user.js');
const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8'));
const userscriptHeader = `// ==UserScript==
// @name         zhihu-hide-menu
// @version      ${packageJson.version}
// @author       you
// @match        https://www.zhihu.com/*
// @match        https://zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @connect      www.zhihu.com
// @connect      zhihu.com
// @connect      zhuanlan.zhihu.com
// @connect      *.zhimg.com
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==
`;

const { stdout, stderr } = await execFileAsync('npm', ['run', 'build:vite']);
if (stdout) {
  process.stdout.write(stdout);
}
if (stderr) {
  process.stderr.write(stderr);
}

const builtSource = await readFile(outFile, 'utf8');
const normalizedSource = builtSource.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\n+/, userscriptHeader);
await writeFile(outFile, normalizedSource);
