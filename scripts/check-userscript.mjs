import { readFile } from 'node:fs/promises';
import path from 'node:path';

const files = ['dist/zhihu-hide-menu-toolkit.user.js'];
const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8'));
const requiredMetadata = [
  ['userscript header', /^\/\/ ==UserScript==/],
  ['script name', /\/\/ @name\s+zhihu-hide-menu/],
  ['script version', new RegExp(`// @version\\s+${packageJson.version.replaceAll('.', '\\.')}`)],
  ['script author', /\/\/ @author\s+you/],
  ['strict mode body', /(["'])use strict\1;?/],
  ['www.zhihu match', /\/\/ @match\s+https:\/\/www\.zhihu\.com\/\*/],
  ['bare zhihu match', /\/\/ @match\s+https:\/\/zhihu\.com\/\*/],
  ['zhuanlan match', /\/\/ @match\s+https:\/\/zhuanlan\.zhihu\.com\/\*/],
];
const canonicalRequired = [
  ['toolbar code', /zhmt-toolbar/],
  ['markdown control', /zhmt-markdown-control/],
  ['home autoload', /zhmt-home-autoload-sentinel/],
];
const canonicalForbidden = [
  ['stale generated boot key', /__zhmtNativeImmersiveLayout/],
  ['stale smoke button body', /ZHMT smoke/],
  ['connectedGraph metadata', /connectedGraph|zhihu-immersive-reader/],
  ['legacy script display name', /Zhihu Hide Menu Toolkit/],
  ['extra userscript header', /\/\/ ==\/UserScript==[\s\S]+\/\/ ==UserScript==/],
  ['namespace metadata', /\/\/ @namespace\b/],
  ['description metadata', /\/\/ @description\b/],
  ['homepage metadata', /\/\/ @homepageURL\b/],
  ['support metadata', /\/\/ @supportURL\b/],
  ['license metadata', /\/\/ @license\b/],
];

let failed = false;

for (const file of files) {
  const source = await readFile(path.resolve(file), 'utf8');

  for (const [name, pattern] of requiredMetadata) {
    if (!pattern.test(source)) {
      console.error(`${file}: missing ${name}`);
      failed = true;
    }
  }

  for (const [name, pattern] of canonicalRequired) {
    if (!pattern.test(source)) {
      console.error(`${file}: missing ${name}`);
      failed = true;
    }
  }

  for (const [name, pattern] of canonicalForbidden) {
    if (pattern.test(source)) {
      console.error(`${file}: contains ${name}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('userscript output looks consistent');
}
